from django.test import TestCase
from django.utils import timezone

from auditoria.models import Auditoria
from usuarios.models import Usuario, GrupoUsuario


class AuditoriaModelTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Administrativos")
		self.usuario = Usuario.objects.create(
			nome="Admin",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)

	def test_criar_auditoria_com_sucesso(self):
		auditoria = Auditoria.objects.create(
			usuario_id=self.usuario,
			hora_mudanca=timezone.now(),
			acao_realizada="Atualizou permissao",
		)

		self.assertEqual(auditoria.usuario_id.id, self.usuario.id)
		self.assertEqual(auditoria.acao_realizada, "Atualizou permissao")
