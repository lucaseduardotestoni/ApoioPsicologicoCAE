from django.db import models
from usuarios.models import Usuario
from permissoes.models import GrupoUsuario

class Comunicado(models.Model):
    titulo = models.CharField(max_length=200)
    mensagem = models.TextField()
    data_em = models.DateTimeField()
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ativo = models.BooleanField(default=True)

class GrupoComunicado(models.Model):
    comunicado_id = models.ForeignKey(Comunicado, on_delete=models.CASCADE)
    grupo_usuario_id = models.ForeignKey(GrupoUsuario, on_delete=models.CASCADE)