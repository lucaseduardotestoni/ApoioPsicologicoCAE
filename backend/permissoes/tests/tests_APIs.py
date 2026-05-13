from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from permissoes.models import NivelPermissao, Permissao, GrupoPermissao
from usuarios.models import GrupoUsuario


class NivelPermissaoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.nivel = NivelPermissao.objects.create(nome="Administrador")

	def test_get_niveis(self):
		response = self.client.get("/api/nivelpermissoes/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_nivel(self):
		response = self.client.post("/api/nivelpermissoes/", {"nome": "Editor"}, format="json")
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class PermissaoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.nivel = NivelPermissao.objects.create(nome="Administrador")
		self.permissao = Permissao.objects.create(nome="GerenciarUsuarios", nivel_permissao_id=self.nivel)

	def test_get_permissoes(self):
		response = self.client.get("/api/permissoes/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_put_permissao(self):
		dados = {"nome": "GerenciarComunicados", "nivel_permissao_id": self.nivel.id}
		response = self.client.put(f"/api/permissoes/{self.permissao.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.permissao.refresh_from_db()
		self.assertEqual(self.permissao.nome, "GerenciarComunicados")


class GrupoPermissaoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.grupo = GrupoUsuario.objects.create(nome="Coordenacao")
		self.nivel = NivelPermissao.objects.create(nome="Administrador")
		self.permissao = Permissao.objects.create(nome="GerenciarUsuarios", nivel_permissao_id=self.nivel)
		self.vinculo = GrupoPermissao.objects.create(
			grupo_usuario_id=self.grupo,
			permissao_id=self.permissao,
			nivel_permissao_id=self.nivel,
		)

	def test_get_grupos_permissoes(self):
		response = self.client.get("/api/grupospermissoes/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_grupo_permissao(self):
		grupo_novo = GrupoUsuario.objects.create(nome="Docentes")
		dados = {
			"grupo_usuario_id": grupo_novo.id,
			"permissao_id": self.permissao.id,
			"nivel_permissao_id": self.nivel.id,
		}
		response = self.client.post("/api/grupospermissoes/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(GrupoPermissao.objects.filter(id=response.data["id"]).exists())

	def test_delete_grupo_permissao(self):
		response = self.client.delete(f"/api/grupospermissoes/{self.vinculo.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
