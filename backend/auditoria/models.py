from django.db import models
from usuarios.models import Usuario

class Auditoria(models.Model):
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    hora_mudanca = models.DateTimeField()
    acao_realizada = models.CharField(max_length=100)