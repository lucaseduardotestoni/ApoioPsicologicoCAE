from django.test import TestCase
from usuarios.models import Usuario, GrupoUsuario
from usuarios.serializers import UsuarioSerializer, GrupoUsuarioSerializer

class GrupoUsuarioSerializerTest(TestCase):

    def test_serializar_grupo_valido(self):
        """Valida a serialização com sucesso de um grupo"""
        grupo = GrupoUsuario.objects.create(nome="Administradores")
        serializer = GrupoUsuarioSerializer(grupo)

        self.assertEqual(serializer.data['nome'], "Administradores")
        self.assertIn('id', serializer.data)

    def test_desserializar_grupo_valido(self):
        """Valida a desserialização com sucesso de um grupo"""
        dados = {'nome': 'Professores'}
        serializer = GrupoUsuarioSerializer(data=dados)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['nome'], 'Professores')
    
    def test_criar_grupo_via_serializer(self):
        """Valida a criação com sucesso de um grupo via serializer"""
        dados = {'nome': 'Professores'}
        serializer = GrupoUsuarioSerializer(data=dados)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        grupo = serializer.save()

        self.assertEqual(grupo.nome, 'Professores')
        self.assertTrue(GrupoUsuario.objects.filter(nome='Professores').exists())

    def test_atualizar_grupo_via_serializer(self):
        """Valida a atualização com sucesso de um grupo via serializer"""
        grupo = GrupoUsuario.objects.create(nome='Professores')
        dados = {'nome': 'Professores Atualizados'}
        serializer = GrupoUsuarioSerializer(grupo, data=dados, partial=True)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        grupo_atualizado = serializer.save()
        self.assertEqual(grupo_atualizado.id, grupo.id)
        self.assertEqual(grupo_atualizado.nome, 'Professores Atualizados')

class UsuarioSerializerTest(TestCase):

    def setUp(self):
        self.grupo = GrupoUsuario.objects.create(nome="Psicólogos")
        self.usuario = Usuario.objects.create(
            nome="Dra. Santos",
            senha_hash="hash123",
            grupo_usuario_id=self.grupo,
            status="ativo"
        )

    def test_serializar_usuario_completo(self):
        """Valida a serialização com sucesso de um usuário"""
        serializer = UsuarioSerializer(self.usuario)
        dados = serializer.data

        self.assertEqual(dados['nome'], "Dra. Santos")
        self.assertEqual(dados['status'], "ativo")
        self.assertIn('id', dados)
        self.assertIn('hora_criado', dados)
        self.assertEqual(dados['grupo_usuario_id'], self.grupo.id)

    def test_desserializar_usuario_novo(self):
        """Valida a desserialização com sucesso de um usuário"""
        dados = {
            'nome': 'Dr. João',
            'senha_hash': 'hash456',
            'grupo_usuario_id': self.grupo.id,
            'status': 'ativo'
        }
        serializer = UsuarioSerializer(data=dados)
        
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['nome'], 'Dr. João')
        self.assertEqual(serializer.validated_data['status'], 'ativo')
        self.assertEqual(serializer.validated_data['grupo_usuario_id'].id, self.grupo.id)

    def test_criar_usuario_via_serializer(self):
        """Valida a criação com sucesso de um usuário via serializer"""
        dados = {
            'nome': 'Dr. João',
            'senha_hash': 'hash456',
            'grupo_usuario_id': self.grupo.id,
            'status': 'ativo'
        }
        serializer = UsuarioSerializer(data=dados)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        novo_usuario = serializer.save()
        self.assertEqual(novo_usuario.nome, 'Dr. João')
        self.assertTrue(Usuario.objects.filter(nome='Dr. João').exists())

    def test_atualizar_usuario_via_serializer(self):
        """Testa atualização de usuário via serializer"""
        dados = {'nome': 'Dra. Santos Atualizada'}
        serializer = UsuarioSerializer(self.usuario, data=dados, partial=True)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario_atualizado = serializer.save()
        self.assertEqual(usuario_atualizado.nome, 'Dra. Santos Atualizada')