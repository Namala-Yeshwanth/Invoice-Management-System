from django.db import models

class Invoice(models.Model):
    id = models.AutoField(primary_key=True)
    invoice_number = models.CharField(max_length=255, unique=True)
    customer_name = models.CharField(max_length=255)
    date = models.DateField()

    def _str_(self):
        return self.invoice_number
    
class InvoiceDetail(models.Model):
    id = models.AutoField(primary_key=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="details" )
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        # Compute the line_total when saving
        self.line_total = self.quantity * self.unit_price
        super(InvoiceDetail, self).save(*args, **kwargs)

    def _str_(self):
        return f"{self.description} - {self.line_total}"
    