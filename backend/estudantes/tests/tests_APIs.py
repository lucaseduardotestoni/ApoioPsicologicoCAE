from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from estudantes.models import Estudante


class EstudanteAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.estudante = Estudante.objects.create(
			nome="Julia",
			codigo_pessoa="3001",
			codigo_vinculo="V3001",
			curso="Direito",
			email="julia@email.com",
		)

	def test_get_estudantes(self):
		response = self.client.get("/api/estudantes/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_get_estudante_por_id(self):
		response = self.client.get(f"/api/estudantes/{self.estudante.id}/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["nome"], "Julia")

	def test_post_estudante(self):
		dados = {
			"nome": "Pedro",
			"codigo_pessoa": "3002",
			"codigo_vinculo": "V3002",
			"curso": "Administracao",
			"email": "pedro@email.com",
		}
		response = self.client.post("/api/estudantes/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Estudante.objects.filter(id=response.data["id"]).exists())

	def test_put_estudante(self):
		dados = {
			"nome": "Julia Santos",
			"codigo_pessoa": "3001",
			"codigo_vinculo": "V3001",
			"curso": "Psicologia",
			"email": "julia@email.com",
		}
		response = self.client.put(f"/api/estudantes/{self.estudante.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.estudante.refresh_from_db()
		self.assertEqual(self.estudante.nome, "Julia Santos")

	def test_delete_estudante(self):
		response = self.client.delete(f"/api/estudantes/{self.estudante.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
