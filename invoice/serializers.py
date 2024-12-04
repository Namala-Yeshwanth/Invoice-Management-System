from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']
        read_only_fields = ['line_total']
    
    def validate( self, data ):
        if data['quantity']<=0: 
            serializers.ValidationError({"quantity": "Quantity must be greater than 0."})
        
        # Validate unit_price
        if data['quantity'] >=10000000000:
            raise serializers.ValidationError({"quantity": "Quantity must be less than 10000000000"})
        # Validate unit_price
        if data['unit_price'] >=10000000000:
            raise serializers.ValidationError({"unit_price": "Unit price must be less than 10000000000"})
        
        # Validate unit_price
        if data['unit_price'] <= 0:
            raise serializers.ValidationError({"unit_price": "Unit price must be greater than 0."})
        return data
    
    # def create(self, validated_data):
    #     # Ensure that the invoice is set correctly from the parent data
    #     invoice_number = validated_data.get('invoice')
    #     return super().create(validated_data)

class InvoiceSerializer(serializers.ModelSerializer):
    # details = InvoiceDetailSerializer(many=True, read_only=True)
    details = InvoiceDetailSerializer(many=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'date', 'details', 'total_amount']

    def get_total_amount(self, obj):
        # Compute the total amount for the invoice
        return sum(item.line_total for item in obj.details.all())
    
    def create(self, validated_data):
        details_data = validated_data.pop('details',[])
        invoice = Invoice.objects.create(**validated_data)
        for detail_data in details_data:
            detail_data ['invoice'] = invoice
            InvoiceDetail.objects.create(**detail_data)
        return invoice
    
    def update(self, instance, validated_data):
        details_data = validated_data.pop('details', [])
        instance.invoice_number = validated_data.get('invoice_number', instance.invoice_number)
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        # Handling nested updates for InvoiceDetails
        existing_details = {detail.id: detail for detail in instance.details.all()}
        for detail_data in details_data:
            detail_id = detail_data.get('id')
            if detail_id and detail_id in existing_details:
                # Update existing InvoiceDetail
                detail_instance = existing_details[detail_id]
                for attr, value in detail_data.items():
                    setattr(detail_instance, attr, value)
                detail_instance.save()
            else:
                # Create new InvoiceDetail
                detail_data['invoice'] = instance
                InvoiceDetail.objects.create(**detail_data)

        # Delete any details that are not included in the update request
        detail_ids = [detail.get('id') for detail in details_data if detail.get('id')]
        for detail_id in existing_details:
            if detail_id not in detail_ids:
                existing_details[detail_id].delete()

        return instance