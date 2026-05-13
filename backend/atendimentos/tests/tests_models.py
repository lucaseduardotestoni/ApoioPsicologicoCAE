from datetime import date

from django.test import TestCase
from django.utils import timezone

from atendimentos.models import RegistroAtendimento
from estudantes.models import Estudante


class RegistroAtendimentoModelTest(TestCase):
	def setUp(self):
		self.estudante = Estudante.objects.create(
			nome="Marina",
			codigo_pessoa="2001",
			codigo_vinculo="V2001",
			curso="Engenharia",
			email="marina@email.com",
		)

	def test_criar_registro_com_sucesso(self):
		registro = RegistroAtendimento.objects.create(
			estudante_id=self.estudante,
			data=date(2026, 2, 1),
			tipo="individual",
			descricao="Primeiro atendimento",
			responsavel="Psicologa A",
			observacoes="Sem intercorrencias",
		)

		self.assertEqual(registro.estudante_id.id, self.estudante.id)
		self.assertEqual(registro.tipo, "individual")

	def test_criado_em_preenchido_automaticamente(self):
		registro = RegistroAtendimento.objects.create(
			estudante_id=self.estudante,
			data=date(2026, 2, 2),
			tipo="grupo",
			descricao="Atendimento em grupo",
			responsavel="Psicologa B",
		)

		self.assertIsNotNone(registro.criado_em)
		self.assertLessEqual(registro.criado_em, timezone.now())
