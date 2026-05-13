from django.test import TestCase

from permissoes.models import NivelPermissao, Permissao, GrupoPermissao
from usuarios.models import GrupoUsuario


class NivelPermissaoModelTest(TestCase):
	def test_criar_nivel_permissao_com_sucesso(self):
		nivel = NivelPermissao.objects.create(nome="Administrador")

		self.assertEqual(nivel.nome, "Administrador")
		self.assertIsNotNone(nivel.id)


class PermissaoModelTest(TestCase):
	def setUp(self):
		self.nivel = NivelPermissao.objects.create(nome="Administrador")

	def test_criar_permissao_com_sucesso(self):
		permissao = Permissao.objects.create(nome="GerenciarUsuarios", nivel_permissao_id=self.nivel)

		self.assertEqual(permissao.nome, "GerenciarUsuarios")
		self.assertEqual(permissao.nivel_permissao_id.id, self.nivel.id)


class GrupoPermissaoModelTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Coordenacao")
		self.nivel = NivelPermissao.objects.create(nome="Administrador")
		self.permissao = Permissao.objects.create(nome="GerenciarUsuarios", nivel_permissao_id=self.nivel)

	def test_criar_grupo_permissao_com_sucesso(self):
		grupo_permissao = GrupoPermissao.objects.create(
			grupo_usuario_id=self.grupo,
			permissao_id=self.permissao,
			nivel_permissao_id=self.nivel,
		)

		self.assertEqual(grupo_permissao.grupo_usuario_id.id, self.grupo.id)
		self.assertEqual(grupo_permissao.permissao_id.id, self.permissao.id)
