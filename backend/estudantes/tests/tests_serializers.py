from django.test import TestCase

from estudantes.models import Estudante
from estudantes.serializers import EstudanteSerializer


class EstudanteSerializerTest(TestCase):
	def setUp(self):
		self.estudante = Estudante.objects.create(
			nome="Julia",
			codigo_pessoa="3001",
			codigo_vinculo="V3001",
			curso="Direito",
			email="julia@email.com",
		)

	def test_serializar_estudante_valido(self):
		serializer = EstudanteSerializer(self.estudante)

		self.assertEqual(serializer.data["nome"], "Julia")
		self.assertEqual(serializer.data["curso"], "Direito")

	def test_criar_estudante_via_serializer(self):
		dados = {
			"nome": "Pedro",
			"codigo_pessoa": "3002",
			"codigo_vinculo": "V3002",
			"curso": "Administracao",
			"email": "pedro@email.com",
		}
		serializer = EstudanteSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		novo = serializer.save()
		self.assertEqual(novo.nome, "Pedro")

	def test_atualizar_estudante_via_serializer(self):
		serializer = EstudanteSerializer(self.estudante, data={"curso": "Psicologia"}, partial=True)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		atualizado = serializer.save()
		self.assertEqual(atualizado.curso, "Psicologia")
