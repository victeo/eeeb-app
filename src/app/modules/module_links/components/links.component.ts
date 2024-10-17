import { Component, OnInit } from '@angular/core';
import { LinksService } from '../services/links.service';
import { Links } from '../models/links.model';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-links',
  templateUrl: './links.component.html'
})
export class LinksComponent implements OnInit {
  links: Links[] = [];

  constructor(private linksService: LinksService) {}

  ngOnInit() {
    // Carrega os links do Firebase
    this.linksService.listarLinks().subscribe((links: Links[]) => {
      this.links = links;
    });
    
  }
}
