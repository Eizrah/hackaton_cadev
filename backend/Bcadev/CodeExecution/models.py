from django.db import models
import uuid
from Accounts.models import Developper


class CodeExecution(models.Model):
    """Historique des exécutions de code pour statistiques et sécurité"""
    
    LANGUAGES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('c', 'C'),
        ('cpp', 'C++'),
        ('java', 'Java'),
        ('php', 'PHP'),
    ]
    
    STATUS = [
        ('success', 'Success'),
        ('error', 'Error'),
        ('timeout', 'Timeout'),
        ('memory_exceeded', 'Memory Exceeded'),
    ]
    
    id_execution = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Developper, on_delete=models.SET_NULL, null=True, blank=True, related_name='executions')
    language = models.CharField(max_length=20, choices=LANGUAGES)
    code = models.TextField()
    stdin = models.TextField(blank=True, default='')
    stdout = models.TextField(blank=True, default='')
    stderr = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS)
    execution_time = models.FloatField(help_text='Temps d\'exécution en secondes')
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'code_execution'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.language} - {self.status} ({self.created_at})"
