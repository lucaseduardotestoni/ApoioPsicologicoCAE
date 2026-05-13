from django.test import TestCase
from django.utils import timezone

from comunicados.models import Comunicado, GrupoComunicado
from comunicados.serializers import ComunicadoSerializer, GrupoComunicadoSerializer
from usuarios.models import Usuario, GrupoUsuario


class ComunicadoSerializerTest(TestCase):
	def setUp(self):
		self.grupo_1 = GrupoUsuario.objects.create(nome="Docentes")
		self.grupo_2 = GrupoUsuario.objects.create(nome="Discentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo_1,
			status="ativo",
		)

	def test_criar_comunicado_via_serializer(self):
		dados = {
			"titulo": "Aviso Geral",
			"mensagem": "Reuniao na sexta",
			"grupo_ids": [self.grupo_1.id, self.grupo_2.id],
		}
		serializer = ComunicadoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		comunicado = serializer.save()
		self.assertEqual(comunicado.titulo, "Aviso Geral")
		self.assertEqual(comunicado.usuario_id.id, self.usuario.id)
		self.assertEqual(GrupoComunicado.objects.filter(comunicado_id=comunicado).count(), 2)

	def test_atualizar_grupos_comunicado_via_serializer(self):
		comunicado = Comunicado.objects.create(
			titulo="Aviso Inicial",
			mensagem="Mensagem inicial",
			data_em=timezone.now(),
			usuario_id=self.usuario,
		)
		GrupoComunicado.objects.create(comunicado_id=comunicado, grupo_usuario_id=self.grupo_1)

		serializer = ComunicadoSerializer(
			comunicado,
			data={"grupo_ids": [self.grupo_2.id], "titulo": "Aviso Atualizado"},
			partial=True,
		)
		self.assertTrue(serializer.is_valid(), serializer.errors)
		atualizado = serializer.save()

		self.assertEqual(atualizado.titulo, "Aviso Atualizado")
		self.assertEqual(GrupoComunicado.objects.filter(comunicado_id=comunicado).count(), 1)


class GrupoComunicadoSerializerTest(TestCase):
	def setUp(self):
		self.grupo = GrupoUsuario.objects.create(nome="Docentes")
		self.usuario = Usuario.objects.create(
			nome="Coordenador",
			senha_hash="hash123",
			grupo_usuario_id=self.grupo,
			status="ativo",
		)
		self.comunicado = Comunicado.objects.create(
			titulo="Aviso",
			mensagem="Conteudo",
			data_em=timezone.now(),
			usuario_id=self.usuario,
		)

	def test_criar_grupo_comunicado_via_serializer(self):
		dados = {"comunicado_id": self.comunicado.id, "grupo_usuario_id": self.grupo.id}
		serializer = GrupoComunicadoSerializer(data=dados)

		self.assertTrue(serializer.is_valid(), serializer.errors)
		vinculo = serializer.save()
		self.assertEqual(vinculo.comunicado_id.id, self.comunicado.id)
