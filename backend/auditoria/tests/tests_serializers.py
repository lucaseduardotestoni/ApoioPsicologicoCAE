from django.test import TestCase
from django.utils import timezone

from auditoria.models import Auditoria
from auditoria.serializers import AuditoriaSerializer
from usuarios.models import Usuario, GrupoUsuario


class AuditoriaSerializerTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Administrativos")
		self.usuario = Usuario.objects.create(
			nome="Admin",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.auditoria = Auditoria.objects.create(
			usuario_id=self.usuario,
			hora_mudanca=timezone.now(),
			acao_realizada="Criou usuario",
		)

	def test_serializar_auditoria_valida(self):
		serializer = AuditoriaSerializer(self.auditoria)

		self.assertEqual(serializer.data["usuario_id"], self.usuario.id)
		self.assertEqual(serializer.data["acao_realizada"], "Criou usuario")

	def test_criar_auditoria_via_serializer(self):
		dados = {
			"usuario_id": self.usuario.id,
			"hora_mudanca": timezone.now().isoformat().replace("+00:00", "Z"),
			"acao_realizada": "Editou comunicado",
		}
		serializer = AuditoriaSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		registro = serializer.save()
		self.assertEqual(registro.acao_realizada, "Editou comunicado")
