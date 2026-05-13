from django.test import TestCase

from estudantes.models import Estudante


class EstudanteModelTest(TestCase):
	def setUp(self):
		self.estudante = Estudante.objects.create(
			nome="Julia",
			codigo_pessoa="3001",
			codigo_vinculo="V3001",
			curso="Direito",
			email="julia@email.com",
		)

	def test_criar_estudante_com_sucesso(self):
		self.assertEqual(self.estudante.nome, "Julia")
		self.assertEqual(self.estudante.codigo_pessoa, "3001")

	def test_estudante_str(self):
		self.assertEqual(str(self.estudante), "Julia")
