from datetime import date, time

from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from agenda.models import HorarioAtendimento, AgendamentoEstudante
from estudantes.models import Estudante
from usuarios.models import Usuario, GrupoUsuario


class HorarioAtendimentoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.grupo = GrupoUsuario.objects.create(nome="Psicologos")
		self.usuario = Usuario.objects.create(
			nome="Dra. Ana",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
		)

	def test_get_horarios(self):
		response = self.client.get("/api/horarios/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_horario(self):
		dados = {
			"data": "2026-01-12",
			"hora_inicio": "14:00:00",
			"hora_fim": "15:00:00",
			"observacao": "Horario adicional",
		}
		response = self.client.post("/api/horarios/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(HorarioAtendimento.objects.filter(id=response.data["id"]).exists())

	def test_put_horario(self):
		dados = {
			"data": "2026-01-15",
			"hora_inicio": "09:30:00",
			"hora_fim": "10:30:00",
			"usuario_id": self.usuario.id,
			"disponivel": True,
			"observacao": "Horario atualizado",
		}
		response = self.client.put(f"/api/horarios/{self.horario.id}/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.horario.refresh_from_db()
		self.assertEqual(str(self.horario.data), "2026-01-15")

	def test_delete_horario(self):
		response = self.client.delete(f"/api/horarios/{self.horario.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class AgendamentoAPITest(APITestCase):
	def setUp(self):
		self.client = APIClient()
		self.grupo = GrupoUsuario.objects.create(nome="Psicologos")
		self.usuario = Usuario.objects.create(
			nome="Dra. Ana",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.estudante = Estudante.objects.create(
			nome="Carlos",
			codigo_pessoa="1001",
			codigo_vinculo="V1001",
		)
		self.horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
		)
		self.agendamento = AgendamentoEstudante.objects.create(
			horario_id=self.horario,
			estudante_id=self.estudante,
			motivo="Acompanhamento",
			status="confirmado",
		)

	def test_get_agendamentos(self):
		response = self.client.get("/api/agendamentos/")
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 1)

	def test_post_agendamento(self):
		dados = {
			"horario_id": self.horario.id,
			"estudante_id": self.estudante.id,
			"motivo": "Escuta ativa",
			"status": "confirmado",
		}
		response = self.client.post("/api/agendamentos/", dados, format="json")

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(AgendamentoEstudante.objects.filter(id=response.data["id"]).exists())

	def test_patch_agendamento(self):
		response = self.client.patch(
			f"/api/agendamentos/{self.agendamento.id}/",
			{"status": "realizado"},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.agendamento.refresh_from_db()
		self.assertEqual(self.agendamento.status, "realizado")

	def test_delete_agendamento(self):
		response = self.client.delete(f"/api/agendamentos/{self.agendamento.id}/")
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
