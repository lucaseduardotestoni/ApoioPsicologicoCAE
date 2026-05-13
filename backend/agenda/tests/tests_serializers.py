from datetime import date, time

from django.test import TestCase

from agenda.models import HorarioAtendimento, AgendamentoEstudante
from agenda.serializers import HorarioAtendimentoSerializer, AgendamentoSerializer
from estudantes.models import Estudante
from usuarios.models import Usuario, GrupoUsuario


class HorarioAtendimentoSerializerTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Psicologos")
		self.usuario = Usuario.objects.create(
			nome="Dra. Ana",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)

	def test_serializar_horario_valido(self):
		horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
		)

		serializer = HorarioAtendimentoSerializer(horario)
		self.assertEqual(serializer.data["usuario_id"], self.usuario.id)
		self.assertEqual(serializer.data["usuario_nome"], "Dra. Ana")

	def test_criar_horario_sem_usuario_auto_atribuido(self):
		dados = {
			"data": "2026-01-12",
			"hora_inicio": "14:00:00",
			"hora_fim": "15:00:00",
			"observacao": "Plantao da tarde",
		}

		serializer = HorarioAtendimentoSerializer(data=dados)
		self.assertTrue(serializer.is_valid(), serializer.errors)

		horario = serializer.save()
		self.assertEqual(horario.usuario_id.id, self.usuario.id)


class AgendamentoSerializerTest(TestCase):
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
		)
		self.horario = HorarioAtendimento.objects.create(
			data=date(2026, 1, 10),
			hora_inicio=time(9, 0),
			hora_fim=time(10, 0),
			usuario_id=self.usuario,
		)

	def test_criar_agendamento_via_serializer(self):
		dados = {
			"horario_id": self.horario.id,
			"estudante_id": self.estudante.id,
			"motivo": "Acompanhamento",
			"status": "confirmado",
		}
		serializer = AgendamentoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		agendamento = serializer.save()
		self.assertEqual(agendamento.status, "confirmado")

	def test_atualizar_agendamento_via_serializer(self):
		agendamento = AgendamentoEstudante.objects.create(
			horario_id=self.horario,
			estudante_id=self.estudante,
			motivo="Acompanhamento",
			status="confirmado",
		)
		serializer = AgendamentoSerializer(agendamento, data={"status": "realizado"}, partial=True)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		atualizado = serializer.save()
		self.assertEqual(atualizado.status, "realizado")
