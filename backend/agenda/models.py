from django.db import models
from usuarios.models import Usuario
from estudantes.models import Estudante

class HorarioAtendimento(models.Model):
    data = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    disponivel = models.BooleanField(default=True)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    observacao = models.TextField(null=True, blank=True)

class AgendamentoEstudante(models.Model):
    horario_id = models.ForeignKey(HorarioAtendimento, on_delete=models.CASCADE)
    estudante_id = models.ForeignKey(Estudante, on_delete=models.CASCADE)
    motivo = models.TextField()
    status = models.CharField(max_length=20)