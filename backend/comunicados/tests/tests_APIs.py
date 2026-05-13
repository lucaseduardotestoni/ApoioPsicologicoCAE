from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from comunicados.models import Comunicado, GrupoComunicado
from usuarios.models import Usuario, GrupoUsuario


class ComunicadoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.grupo_1 = GrupoUsuario.objects.create(nome="Docentes")
		self.grupo_2 = GrupoUsuario.objects.create(nome="Discentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo_1,
			status="ativo",
		)
		self.comunicado = Comunicado.objects.create(
			titulo="Aviso Inicial",
			mensagem="Mensagem inicial",
			data_em=timezone.now(),
			usuario_id=self.usuario,
			ativo=True,
		)
		GrupoComunicado.objects.create(comunicado_id=self.comunicado, grupo_usuario_id=self.grupo_1)

	def test_get_comunicados(self):
		response = self.client.get("/api/comunicados/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_comunicado(self):
		dados = {
			"titulo": "Aviso Novo",
			"mensagem": "Detalhes do aviso",
			"ativo": True,
			"grupo_ids": [self.grupo_1.id, self.grupo_2.id],
		}
		response = self.client.post("/api/comunicados/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Comunicado.objects.filter(id=response.data["id"]).exists())

	def test_put_comunicado(self):
		dados = {
			"titulo": "Aviso Atualizado",
			"mensagem": "Mensagem atualizada",
			"ativo": True,
			"grupo_ids": [self.grupo_2.id],
		}
		response = self.client.put(f"/api/comunicados/{self.comunicado.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.comunicado.refresh_from_db()
		self.assertEqual(self.comunicado.titulo, "Aviso Atualizado")

	def test_delete_comunicado(self):
		response = self.client.delete(f"/api/comunicados/{self.comunicado.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class GrupoComunicadoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.grupo = GrupoUsuario.objects.create(nome="Docentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.comunicado = Comunicado.objects.create(
			titulo="Aviso",
			mensagem="Conteudo",
			data_em=timezone.now(),
			usuario_id=self.usuario,
		)
		self.vinculo = GrupoComunicado.objects.create(
			comunicado_id=self.comunicado,
			grupo_usuario_id=self.grupo,
		)

	def test_get_grupos_comunicados(self):
		response = self.client.get("/api/gruposcomunicados/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_grupo_comunicado(self):
		grupo_novo = GrupoUsuario.objects.create(nome="Tecnicos")
		dados = {"comunicado_id": self.comunicado.id, "grupo_usuario_id": grupo_novo.id}
		response = self.client.post("/api/gruposcomunicados/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(GrupoComunicado.objects.filter(id=response.data["id"]).exists())

	def test_delete_grupo_comunicado(self):
		response = self.client.delete(f"/api/gruposcomunicados/{self.vinculo.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
