# from django.test import TestCase
# from rest_framework.test import APITestCase, APIClient
# from rest_framework import status
# from django.utils import timezone
# from django.urls import reverse

# from usuarios.models import Usuario, GrupoUsuario
# from usuarios.serializers import UsuarioSerializer, GrupoUsuarioSerializer


# # ============================================================================
# # TESTES DE MODELO
# # ============================================================================



# # ============================================================================
# # TESTES DE SERIALIZER
# # ============================================================================



# # ============================================================================
# # TESTES DE API (ViewSet)
# # ============================================================================

# class UsuarioAPITest(APITestCase):
#     """Testes de API para endpoints de usuário"""

#     def setUp(self):
#         """Configura cliente HTTP e dados iniciais"""
#         self.client = APIClient()
#         self.grupo = GrupoUsuario.objects.create(nome="Psicólogos")
#         self.usuario = Usuario.objects.create(
#             nome="Dr. Silva",
#             senha_hash="hash123",
#             grupo_usuario_id=self.grupo,
#             status="ativo"
#         )

#     def test_listar_usuarios(self):
#         """Testa GET /api/usuarios/"""
#         response = self.client.get('/api/usuarios/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertGreaterEqual(len(response.data), 1)
#         self.assertEqual(response.data[0]['nome'], "Dr. Silva")

#     def test_recuperar_usuario_por_id(self):
#         """Testa GET /api/usuarios/{id}/"""
#         response = self.client.get(f'/api/usuarios/{self.usuario.id}/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['nome'], "Dr. Silva")
#         self.assertEqual(response.data['status'], "ativo")

#     def test_criar_usuario(self):
#         """Testa POST /api/usuarios/"""
#         dados = {
#             'nome': 'Dra. Nova',
#             'senha_hash': 'hash789',
#             'grupo_usuario_id': self.grupo.id,
#             'status': 'ativo'
#         }
#         response = self.client.post('/api/usuarios/', dados, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(response.data['nome'], 'Dra. Nova')
#         self.assertTrue(Usuario.objects.filter(nome='Dra. Nova').exists())

#     def test_atualizar_usuario_completo(self):
#         """Testa PUT /api/usuarios/{id}/ (atualização completa)"""
#         dados = {
#             'nome': 'Dr. Silva Atualizado',
#             'senha_hash': 'hash_novo',
#             'grupo_usuario_id': self.grupo.id,
#             'status': 'ativo'
#         }
#         response = self.client.put(f'/api/usuarios/{self.usuario.id}/', dados, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.usuario.refresh_from_db()
#         self.assertEqual(self.usuario.nome, 'Dr. Silva Atualizado')

#     def test_atualizar_usuario_parcial(self):
#         """Testa PATCH /api/usuarios/{id}/ (atualização parcial)"""
#         dados = {'status': 'bloqueado'}
#         response = self.client.patch(f'/api/usuarios/{self.usuario.id}/', dados, format='json')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.usuario.refresh_from_db()
#         self.assertEqual(self.usuario.status, 'bloqueado')
#         self.assertEqual(self.usuario.nome, 'Dr. Silva')  # Não foi alterado

#     def test_deletar_usuario(self):
#         """Testa DELETE /api/usuarios/{id}/"""
#         usuario_id = self.usuario.id
#         response = self.client.delete(f'/api/usuarios/{usuario_id}/')

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertFalse(Usuario.objects.filter(id=usuario_id).exists())

#     def test_criar_usuario_nome_vazio(self):
#         """Testa validação: rejeita usuário sem nome"""
#         dados = {
#             'nome': '',  # Inválido
#             'senha_hash': 'hash789',
#             'grupo_usuario_id': self.grupo.id,
#             'status': 'ativo'
#         }
#         response = self.client.post('/api/usuarios/', dados, format='json')

#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_recuperar_usuario_inexistente(self):
#         """Testa GET com ID que não existe"""
#         response = self.client.get('/api/usuarios/9999/')

#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# class GrupoUsuarioAPITest(APITestCase):
#     """Testes de API para endpoints de grupo"""

#     def setUp(self):
#         self.client = APIClient()
#         self.grupo = GrupoUsuario.objects.create(nome="Administrativos")

#     def test_listar_grupos(self):
#         """Testa GET /api/gruposusuarios/"""
#         response = self.client.get('/api/gruposusuarios/')

#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertGreaterEqual(len(response.data), 1)

#     def test_criar_grupo(self):
#         """Testa POST /api/gruposusuarios/"""
#         dados = {'nome': 'Monitores'}
#         response = self.client.post('/api/gruposusuarios/', dados, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertTrue(GrupoUsuario.objects.filter(nome='Monitores').exists())

#     def test_deletar_grupo(self):
#         """Testa DELETE /api/gruposusuarios/{id}/"""
#         grupo_id = self.grupo.id
#         response = self.client.delete(f'/api/gruposusuarios/{grupo_id}/')

#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertFalse(GrupoUsuario.objects.filter(id=grupo_id).exists())
