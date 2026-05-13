from datetime import date

from django.test import TestCase

from atendimentos.models import RegistroAtendimento
from atendimentos.serializers import AtendimentoSerializer
from estudantes.models import Estudante


class AtendimentoSerializerTest(TestCase):
	def setUp(self):
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

	def test_serializar_registro_valido(self):
		serializer = AtendimentoSerializer(self.registro)

		self.assertEqual(serializer.data["tipo"], "individual")
		self.assertEqual(serializer.data["estudante_nome"], "Marina")

	def test_criar_registro_via_serializer(self):
		dados = {
			"estudante_id": self.estudante.id,
			"data": "2026-02-03",
			"tipo": "grupo",
			"descricao": "Acolhimento coletivo",
			"responsavel": "Psicologa B",
			"observacoes": "Boa adesao",
		}
		serializer = AtendimentoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		novo = serializer.save()
		self.assertEqual(novo.tipo, "grupo")

	def test_atualizar_registro_via_serializer(self):
		serializer = AtendimentoSerializer(self.registro, data={"tipo": "retorno"}, partial=True)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		atualizado = serializer.save()
		self.assertEqual(atualizado.tipo, "retorno")
