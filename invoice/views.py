from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from .models import Invoice, InvoiceDetail
from .serializers import InvoiceSerializer, InvoiceDetailSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination


class InvoicePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'  # Allows clients to specify the page size
    max_page_size = 6  # Maximum rows allowed per page
    
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.prefetch_related('details').all()
    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]
    pagination_class = InvoicePagination
    
    # Custom action to calculate total_amount
    @action(detail=True, methods=['get'])
    def total_amount(self, request, pk=None):
        invoice = self.get_object()
        total = sum(item.line_total for item in invoice.details.all())
        return Response({'total_amount': total})

class InvoiceDetailViewSet(viewsets.ModelViewSet):
    queryset = InvoiceDetail.objects.all()
    serializer_class = InvoiceDetailSerializer

@api_view(['POST'])
def create_invoice(request):
    # Create the invoice
    invoice_data = request.data
    invoice_serializer = InvoiceSerializer(data=invoice_data)

    if invoice_serializer.is_valid():
        invoice = invoice_serializer.save()

        # Now create invoice details
        details_data = invoice_data.get('details', [])
        for detail in details_data:
            detail['invoice'] = invoice.id  # Link the detail to the invoice
            detail_serializer = InvoiceDetailSerializer(data=detail)
            if detail_serializer.is_valid():
                detail_serializer.save()
            else:
                return Response(detail_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(invoice_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(invoice_serializer.errors, status=status.HTTP_400_BAD_REQUEST)