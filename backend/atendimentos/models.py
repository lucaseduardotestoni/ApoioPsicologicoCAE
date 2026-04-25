from django.db import models
from estudantes.models import Estudante

class RegistroAtendimento(models.Model):
    estudante_id = models.ForeignKey(Estudante, on_delete=models.CASCADE)
    data = models.DateField()
    tipo = models.CharField(max_length=20)
    descricao = models.TextField()
    responsavel = models.CharField(max_length=150)
    observacoes = models.TextField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)