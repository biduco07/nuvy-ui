// nuvy-ui — serviço do botão de tema (Angular 21+). Copie para src/app/core/tema.service.ts.
// Trabalha junto com public/nuvy-tema.js, que aplica a classe antes da primeira pintura.
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type ModoTema = 'escuro' | 'claro';

const CHAVE = 'nuvy-tema';

@Injectable({ providedIn: 'root' })
export class TemaService {
  private readonly documento = inject(DOCUMENT);
  private readonly noNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /** Escuro por padrão; claro só quando a pessoa escolheu. */
  readonly modo = signal<ModoTema>(this.lerEscolha());

  alternar(): void {
    this.definir(this.modo() === 'escuro' ? 'claro' : 'escuro');
  }

  definir(modo: ModoTema): void {
    this.modo.set(modo);
    if (!this.noNavegador) return;
    const html = this.documento.documentElement;
    html.classList.toggle('dark', modo === 'escuro');
    html.style.colorScheme = modo === 'escuro' ? 'dark' : 'light';
    try {
      localStorage.setItem(CHAVE, modo);
    } catch {
      // localStorage bloqueado: a escolha vale só nesta visita
    }
  }

  private lerEscolha(): ModoTema {
    if (!this.noNavegador) return 'escuro';
    try {
      return localStorage.getItem(CHAVE) === 'claro' ? 'claro' : 'escuro';
    } catch {
      return 'escuro';
    }
  }
}
