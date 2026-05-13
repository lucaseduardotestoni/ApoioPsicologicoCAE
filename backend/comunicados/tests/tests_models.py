from django.test import TestCase
from django.utils import timezone

from comunicados.models import Comunicado, GrupoComunicado
from usuarios.models import Usuario, GrupoUsuario


class ComunicadoModelTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Docentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)

	def test_criar_comunicado_com_sucesso(self):
		comunicado = Comunicado.objects.create(
			titulo="Boas-vindas",
			mensagem="Inicio do semestre",
			data_em=timezone.now(),
			usuario_id=self.usuario,
		)

		self.assertEqual(comunicado.usuario_id.id, self.usuario.id)
		self.assertTrue(comunicado.ativo)


class GrupoComunicadoModelTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Docentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.comunicado = Comunicado.objects.create(
			titulo="Boas-vindas",
			mensagem="Inicio do semestre",
			data_em=timezone.now(),
			usuario_id=self.usuario,
		)

	def test_criar_grupo_comunicado_com_sucesso(self):
		vinculo = GrupoComunicado.objects.create(
			comunicado_id=self.comunicado,
			grupo_usuario_id=self.grupo,
		)

		self.assertEqual(vinculo.comunicado_id.id, self.comunicado.id)
		self.assertEqual(vinculo.grupo_usuario_id.id, self.grupo.id)
