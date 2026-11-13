from django.urls import path
from .views import ExecuteCodeView, ExecutionHistoryView, HealthCheckView

urlpatterns = [
    path('execute/', ExecuteCodeView.as_view(), name='execute-code'),
    path('history/', ExecutionHistoryView.as_view(), name='execution-history'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
