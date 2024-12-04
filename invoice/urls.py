from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, InvoiceDetailViewSet

# Set up the router
router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet)
router.register(r'details', InvoiceDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
