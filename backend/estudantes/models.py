from django.db import models

class Estudante(models.Model):
    nome = models.CharField(max_length=150)
    codigo_pessoa = models.CharField(max_length=20)
    codigo_vinculo = models.CharField(max_length=20)
    curso = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.nome