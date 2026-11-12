import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: ` <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" routerLink="/dashboard"
        ><span class="brand-icon">↗</span> momentum<span class="brand-dot">.</span></a
      >
      <div class="workspace-label">YOUR WORKSPACE</div>
      <nav aria-label="Main navigation">
        <a routerLink="/dashboard" routerLinkActive="nav-active"><span>▦</span> Dashboard</a
        ><a routerLink="/goals" routerLinkActive="nav-active"><span>◎</span> My goals</a>
      </nav>
      <div class="sidebar-bottom">
        <div class="mini-art">✧</div>
        <h3>Small steps.<br />Big possibilities.</h3>
        <p>A little progress every day<br />adds up to something great.</p>
        <a routerLink="/goals/new">Make your next move ↗</a>
      </div>
      <div class="profile">
        <span class="avatar">M</span>
        <div><strong>My workspace</strong><small>Personal goal tracker</small></div>
        <span class="online-dot"></span>
      </div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <span>Your space to grow</span>
        <div class="flex items-center gap-4">
          <span class="today">{{ today }}</span><span class="avatar small">M</span>
        </div>
      </header>
      <main><router-outlet /></main>
      <footer>Made for the things that matter. <span>One goal at a time ↗</span></footer>
    </div>
  </div>`,
})
export class AppComponent {
  today = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(),
  );
}
