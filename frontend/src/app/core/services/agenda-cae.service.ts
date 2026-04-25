import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HorarioAtendimento, AgendamentoEstudante } from '../models/atendimento.model';

@Injectable({ providedIn: 'root' })
export class AgendaCaeService {

  private horariosSubject = new BehaviorSubject<HorarioAtendimento[]>([]);
  private agendamentosSubject = new BehaviorSubject<AgendamentoEstudante[]>([]);

  horarios$ = this.horariosSubject.asObservable();
  agendamentos$ = this.agendamentosSubject.asObservable();
    horarios: any;

  // 🔹 Criar horário
  criarHorario(horario: HorarioAtendimento) {
    const atual = this.horariosSubject.value;
    this.horariosSubject.next([...atual, { ...horario, id: Date.now() }]);
  }

  // 🔹 Atualizar horário
  atualizarHorario(horario: HorarioAtendimento) {
    const atual = this.horariosSubject.value.map(h =>
      h.id === horario.id ? horario : h
    );
    this.horariosSubject.next(atual);
  }

  // 🔹 Remover horário
  removerHorario(id: number) {
    this.horariosSubject.next(
      this.horariosSubject.value.filter(h => h.id !== id)
    );
  }

  // 🔹 Criar agendamento estudante
  agendarEstudante(agendamento: AgendamentoEstudante) {
    const atual = this.agendamentosSubject.value;
    this.agendamentosSubject.next([...atual, { ...agendamento, id: Date.now() }]);
  }

  // 🔹 Buscar horários disponíveis
  listarDisponiveis() {
    return this.horariosSubject.value.filter(h => h.disponivel);
  }
  get horariosSnapshot() {
  return this.horariosSubject.value;
}
}