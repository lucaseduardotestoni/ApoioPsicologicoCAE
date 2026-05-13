from datetime import date, time

from django.test import TestCase

from agenda.models import HorarioAtendimento, AgendamentoEstudante
from estudantes.models import Estudante
from usuarios.models import Usuario, GrupoUsuario


class HorarioAtendimentoModelTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Psicologos")
		self.usuario = Usuario.objects.create(
			nome="Dra. Ana",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)

	def test_criar_horario_com_sucesso(self):
		horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
			observacao="Atendimento matinal",
		)

		self.assertEqual(horario.usuario_id.id, self.usuario.id)
		self.assertTrue(horario.disponivel)


class AgendamentoEstudanteModelTest(TestCase):
	def setUp(self):
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
			curso="Computacao",
			email="carlos@email.com",
		)
		self.horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
		)

	def test_criar_agendamento_com_sucesso(self):
		agendamento = AgendamentoEstudante.objects.create(
			horario_id=self.horario,
			estudante_id=self.estudante,
			motivo="Conversa de acolhimento",
			status="confirmado",
		)

		self.assertEqual(agendamento.estudante_id.id, self.estudante.id)
		self.assertEqual(agendamento.horario_id.id, self.horario.id)
		self.assertEqual(agendamento.status, "confirmado")
