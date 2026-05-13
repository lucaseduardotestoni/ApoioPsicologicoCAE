from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from auditoria.models import Auditoria
from usuarios.models import Usuario, GrupoUsuario


class AuditoriaAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
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

	def test_get_auditoria(self):
		response = self.client.get("/api/auditoria/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_auditoria(self):
		dados = {
			"usuario_id": self.usuario.id,
			"hora_mudanca": timezone.now().isoformat().replace("+00:00", "Z"),
			"acao_realizada": "Atualizou agenda",
		}
		response = self.client.post("/api/auditoria/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Auditoria.objects.filter(id=response.data["id"]).exists())

	def test_put_auditoria(self):
		dados = {
			"usuario_id": self.usuario.id,
			"hora_mudanca": timezone.now().isoformat().replace("+00:00", "Z"),
			"acao_realizada": "Atualizou permissao",
		}
		response = self.client.put(f"/api/auditoria/{self.auditoria.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.auditoria.refresh_from_db()
		self.assertEqual(self.auditoria.acao_realizada, "Atualizou permissao")

	def test_delete_auditoria(self):
		response = self.client.delete(f"/api/auditoria/{self.auditoria.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
