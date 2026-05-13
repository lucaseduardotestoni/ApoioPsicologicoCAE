from datetime import date

from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from atendimentos.models import RegistroAtendimento
from estudantes.models import Estudante


class AtendimentoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.estudante = Estudante.objects.create(
			nome="Marina",
			codigo_pessoa="2001",
			codigo_vinculo="V2001",
		)
		self.registro = RegistroAtendimento.objects.create(
			estudante_id=self.estudante,
			data=date(2026, 2, 1),
			tipo="individual",
			descricao="Primeiro atendimento",
			responsavel="Psicologa A",
		)

	def test_get_atendimentos(self):
		response = self.client.get("/api/atendimentos/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_get_atendimento_por_id(self):
		response = self.client.get(f"/api/atendimentos/{self.registro.id}/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["tipo"], "individual")

	def test_post_atendimento(self):
		dados = {
			"estudante_id": self.estudante.id,
			"data": "2026-02-05",
			"tipo": "grupo",
			"descricao": "Acolhimento coletivo",
			"responsavel": "Psicologa B",
			"observacoes": "Turma colaborativa",
		}
		response = self.client.post("/api/atendimentos/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(RegistroAtendimento.objects.filter(id=response.data["id"]).exists())

	def test_put_atendimento(self):
		dados = {
			"estudante_id": self.estudante.id,
			"data": "2026-02-06",
			"tipo": "retorno",
			"descricao": "Sessao de retorno",
			"responsavel": "Psicologa A",
			"observacoes": "Evolucao positiva",
		}
		response = self.client.put(f"/api/atendimentos/{self.registro.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.registro.refresh_from_db()
		self.assertEqual(self.registro.tipo, "retorno")

	def test_delete_atendimento(self):
		response = self.client.delete(f"/api/atendimentos/{self.registro.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
