from django.test import TestCase
from pytz import timezone
from usuarios.models import Usuario, GrupoUsuario

class GrupoUsuarioModelTest(TestCase):
    """Testes para o modelo GrupoUsuario"""

    def setUp(self):
        self.grupo = GrupoUsuario.objects.create(nome="Psicólogos")

    def test_grupo_criacao_sucesso(self):
        """Valida a criação com sucesso de um grupo"""
        self.assertTrue(GrupoUsuario.objects.filter(nome="Psicólogos").exists())
        self.assertEqual(self.grupo.nome, "Psicólogos")

    def test_grupo_str(self):
        """Valida a representação em string nome do grupo"""
        self.assertEqual(str(self.grupo), "Psicólogos")

    def test_grupo_id_auto_increment(self):
        """Valida a geração automática de ID"""
        self.assertIsNotNone(self.grupo.id)


class UsuarioModelTest(TestCase):
    """Testes para o modelo Usuario"""

    def setUp(self):
        self.grupo = GrupoUsuario.objects.create(nome="Psicólogos")
        self.usuario = Usuario.objects.create(
            nome="Dr. Silva",
            senha_hash="hash123",
            grupo_usuario_id=self.grupo,
            status="ativo",
            mudou_senha=False
        )

    def test_usuario_criacao_sucesso(self):
        """Testa a criação com sucesso de um usuário"""
        self.assertEqual(self.usuario.nome, "Dr. Silva")
        self.assertEqual(self.usuario.status, "ativo")
        self.assertEqual(self.usuario.grupo_usuario_id, self.grupo)

    def test_usuario_str(self):
        """Valida a representação em string do nome do usuário"""
        self.assertEqual(str(self.usuario), "Dr. Silva")

    def test_usuario_hora_criado_auto(self):
        """Valida que hora_criado é preenchido automaticamente"""
        self.assertIsNotNone(self.usuario.hora_criado)
        self.assertLessEqual(self.usuario.hora_criado, timezone.now())

    def test_usuario_mudou_senha_default(self):
        """Valida que mudou_senha por padrão é False"""
        usuario_novo = Usuario.objects.create(
            nome="Dr. Novo",
            senha_hash="hash123",
            grupo_usuario_id=self.grupo,
            status="ativo"
        )
        self.assertFalse(usuario_novo.mudou_senha)

    def test_usuario_bloqueio(self):
        """Valida que o bloqueio de usuário com motivo e data"""
        self.usuario.status = "bloqueado"
        self.usuario.motivo_bloqueio = "Suspensão por utilização incorreta"
        self.usuario.data_bloqueio = timezone.now()
        self.usuario.save()

        usuario_recarregado = Usuario.objects.get(id=self.usuario.id)
        self.assertEqual(usuario_recarregado.status, "bloqueado")
        self.assertIsNotNone(usuario_recarregado.data_bloqueio)
        self.assertEqual(usuario_recarregado.motivo_bloqueio, "Suspensão por utilização incorreta")

    def test_usuario_relacionamento_grupo(self):
        """Valida que usuário está relacionado ao grupo correto"""
        self.assertEqual(self.usuario.grupo_usuario_id.nome, "Psicólogos")
