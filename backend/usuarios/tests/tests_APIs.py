from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.utils import timezone
from django.urls import reverse

from usuarios.models import Usuario, GrupoUsuario
from usuarios.serializers import UsuarioSerializer, GrupoUsuarioSerializer

class GrupoUsuarioAPITest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.grupo = GrupoUsuario.objects.create(nome="Administrativos")

    def test_get_grupos(self):
        """Valida GET /api/gruposusuarios/"""
        response = self.client.get('/api/gruposusuarios/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_grupo_id(self):
        """Valida GET /api/gruposusuarios/{id}/"""
        response = self.client.get(f'/api/gruposusuarios/{self.grupo.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], "Administrativos")

    def test_post_grupo(self):
        """Valida POST /api/gruposusuarios/"""
        dados = {'nome': 'Monitores'}
        response = self.client.post('/api/gruposusuarios/', dados, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(GrupoUsuario.objects.filter(nome='Monitores').exists())

    def test_put_grupo(self):
        """Valida PUT /api/gruposusuarios/{id}/"""
        dados = {'nome': 'Monitores Atualizados'}
        response = self.client.put(f'/api/gruposusuarios/{self.grupo.id}/', dados, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(GrupoUsuario.objects.filter(nome='Monitores Atualizados').exists())

    def test_delete_grupo(self):
        """Valida DELETE /api/gruposusuarios/{id}/"""
        grupo_id = self.grupo.id
        response = self.client.delete(f'/api/gruposusuarios/{grupo_id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(GrupoUsuario.objects.filter(id=grupo_id).exists())

class UsuarioAPITest(APITestCase):

    def setUp(self):
        """Configura cliente HTTP e dados iniciais"""
        self.client = APIClient()
        self.grupo = GrupoUsuario.objects.create(nome="Psicólogos")
        self.usuario = Usuario.objects.create(
            nome="Dr. Silva",
            senha_hash="hash123",
            grupo_usuario_id=self.grupo,
            status="ativo"
        )

    def test_get_usuarios(self):
        """Testa GET /api/usuarios/"""
        response = self.client.get('/api/usuarios/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], "Dr. Silva")

    def test_get_usuario_id(self):
        """Testa GET /api/usuarios/{id}/"""
        response = self.client.get(f'/api/usuarios/{self.usuario.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], "Dr. Silva")
        self.assertEqual(response.data['status'], "ativo")

    def test_post_usuario(self):
        """Testa POST /api/usuarios/"""
        dados = {
            'nome': 'Dra. Nova',
            'senha_hash': 'hash456',
            'grupo_usuario_id': self.grupo.id,
            'status': 'ativo'
        }
        response = self.client.post('/api/usuarios/', dados, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nome'], 'Dra. Nova')
        self.assertTrue(Usuario.objects.filter(nome='Dra. Nova').exists())

    def test_put_usuario(self):
        """Testa PUT /api/usuarios/{id}/ (atualização completa)"""
        grupo = GrupoUsuario.objects.create(nome="Psicólogos")
        dados = {
            'nome': 'Dr. Silva Atualizado',
            'senha_hash': 'hash_novo',
            'grupo_usuario_id': grupo.id,
            'status': 'desativo'
        }
        response = self.client.put(f'/api/usuarios/{self.usuario.id}/', dados, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.nome, 'Dr. Silva Atualizado')
        self.assertEqual(self.usuario.status, 'desativo')
        self.assertEqual(self.usuario.grupo_usuario_id.id, grupo.id)

    def test_patch_usuario_nome(self):
        """Testa PATCH /api/usuarios/{id}/ (atualização parcial)"""
        dados = {'nome': 'Dr. Silva Alterado'}
        response = self.client.patch(f'/api/usuarios/{self.usuario.id}/', dados, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.nome, 'Dr. Silva Alterado')

    def test_delete_usuario(self):
        """Testa DELETE /api/usuarios/{id}/"""
        usuario_id = self.usuario.id
        response = self.client.delete(f'/api/usuarios/{usuario_id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Usuario.objects.filter(id=usuario_id).exists())