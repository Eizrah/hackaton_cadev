from django.contrib import admin
from .models import CodeExecution


@admin.register(CodeExecution)
class CodeExecutionAdmin(admin.ModelAdmin):
    list_display = ['id_execution', 'user', 'language', 'status', 'execution_time', 'created_at']
    list_filter = ['language', 'status', 'created_at']
    search_fields = ['user__email', 'code', 'stdout', 'stderr']
    readonly_fields = ['id_execution', 'created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Exécution', {
            'fields': ('id_execution', 'user', 'language', 'status', 'execution_time', 'created_at', 'ip_address')
        }),
        ('Code', {
            'fields': ('code', 'stdin'),
            'classes': ('collapse',)
        }),
        ('Résultat', {
            'fields': ('stdout', 'stderr'),
            'classes': ('collapse',)
        }),
    )
