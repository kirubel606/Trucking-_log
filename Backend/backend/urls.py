from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from trips.views import TripViewSet, LogEntryViewSet
from trips.generatelog import  generate_log_sheet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logs', LogEntryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # New URL for generating log sheet PDF
    path('api/generate-log/', generate_log_sheet, name='generate_log'),
]
