from django.db import models
from usuarios.models import GrupoUsuario

class NivelPermissao(models.Model):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.descricao

class Permissao(models.Model):
    nome = models.CharField(max_length=30)
    nivel_permissao_id = models.ForeignKey(NivelPermissao, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome
   
class GrupoPermissao(models.Model):
    grupo_usuario_id = models.ForeignKey(GrupoUsuario, on_delete=models.CASCADE)
    permissao_id = models.ForeignKey(Permissao, on_delete=models.CASCADE)
    nivel_permissao_id = models.ForeignKey(NivelPermissao, on_delete=models.CASCADE)