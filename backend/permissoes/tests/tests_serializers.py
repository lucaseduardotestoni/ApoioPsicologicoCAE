from django.test import TestCase

from permissoes.models import NivelPermissao, Permissao, GrupoPermissao
from permissoes.serializers import (
	NivelPermissaoSerializer,
	PermissaoSerializer,
	GrupoPermissaoSerializer,
)
from usuarios.models import GrupoUsuario


class NivelPermissaoSerializerTest(TestCase):
	def test_criar_nivel_via_serializer(self):
		serializer = NivelPermissaoSerializer(data={"nome": "Administrador"})

		self.assertTrue(serializer.is_valid(), serializer.errors)
		nivel = serializer.save()
		self.assertEqual(nivel.nome, "Administrador")


class PermissaoSerializerTest(TestCase):
	def setUp(self):
		self.nivel = NivelPermissao.objects.create(nome="Administrador")

	def test_criar_permissao_via_serializer(self):
		dados = {"nome": "GerenciarUsuarios", "nivel_permissao_id": self.nivel.id}
		serializer = PermissaoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		permissao = serializer.save()
		self.assertEqual(permissao.nome, "GerenciarUsuarios")


class GrupoPermissaoSerializerTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Coordenacao")
		self.nivel = NivelPermissao.objects.create(nome="Administrador")
		self.permissao = Permissao.objects.create(nome="GerenciarUsuarios", nivel_permissao_id=self.nivel)

	def test_criar_grupo_permissao_via_serializer(self):
		dados = {
			"grupo_usuario_id": self.grupo.id,
			"permissao_id": self.permissao.id,
			"nivel_permissao_id": self.nivel.id,
		}
		serializer = GrupoPermissaoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		vinculo = serializer.save()
		self.assertEqual(vinculo.grupo_usuario_id.id, self.grupo.id)
