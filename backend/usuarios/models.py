from django.db import models

class GrupoUsuario(models.Model):
    nome = models.CharField(max_length=30)

    def __str__(self):
        return self.nome
    
class Usuario(models.Model):
    nome = models.CharField(max_length=75)
    senha_hash = models.CharField(max_length=255)
    grupo_usuario_id = models.ForeignKey(GrupoUsuario, on_delete=models.CASCADE)
    hora_criado = models.DateTimeField(auto_now_add=True)
    mudou_senha = models.BooleanField(default=False)
    status = models.CharField(max_length=20)
    data_bloqueio = models.DateTimeField(null=True, blank=True)
    motivo_bloqueio = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nome
    
