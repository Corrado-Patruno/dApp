#!/usr/bin/env python3

"""
Script per generare grafici dai dati di performance
Legge performance_results.json e crea un grafico con matplotlib
"""

import json
import csv
from pathlib import Path
import sys

try:
    import matplotlib.pyplot as plt
    import numpy as np
except ImportError:
    print("❌ Errore: matplotlib non è installato")
    print("Installa con: pip install matplotlib numpy")
    sys.exit(1)

def load_results(filename="results/performance_results.csv"):
    """Carica i risultati dal file CSV"""
    filepath = Path(__file__).parent / filename
    
    if not filepath.exists():
        print(f"❌ File non trovato: {filepath}")
        print("Esegui prima: ./measure_performance.sh")
        sys.exit(1)
    
    results = []
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            results.append({
                'numero_note': int(row['numero_note']),
                'iterazione': int(row['iterazione']),
                'creazione_ms': float(row['creazione_ms']),
                'lettura_ms': float(row['lettura_ms']),
                'eliminazione_ms': float(row['eliminazione_ms']),
                'timestamp': row['timestamp']
            })
    
    return results

def aggregate_results(results):
    """Aggrega i risultati per numero di note"""
    aggregated = {}
    
    for result in results:
        num_notes = result['numero_note']
        
        if num_notes not in aggregated:
            aggregated[num_notes] = {
                'creazione': [],
                'lettura': [],
                'eliminazione': []
            }
        
        aggregated[num_notes]['creazione'].append(float(result['creazione_ms']))
        aggregated[num_notes]['lettura'].append(float(result['lettura_ms']))
        aggregated[num_notes]['eliminazione'].append(float(result['eliminazione_ms']))
    
    return aggregated

def create_charts(aggregated):
    """Crea i grafici"""
    
    # Ordina per numero di note
    num_notes = sorted(aggregated.keys())
    
    # Calcola le medie
    create_means = [np.mean(aggregated[n]['creazione']) for n in num_notes]
    read_means = [np.mean(aggregated[n]['lettura']) for n in num_notes]
    remove_means = [np.mean(aggregated[n]['eliminazione']) for n in num_notes]
    
    # Calcola le deviazioni standard
    create_std = [np.std(aggregated[n]['creazione']) for n in num_notes]
    read_std = [np.std(aggregated[n]['lettura']) for n in num_notes]
    remove_std = [np.std(aggregated[n]['eliminazione']) for n in num_notes]
    
    # Figura 1: Tre operazioni su uno stesso grafico
    plt.figure(figsize=(12, 7))
    
    plt.errorbar(num_notes, create_means, yerr=create_std, 
                 marker='o', label='Creazione (ms)', linewidth=2, capsize=5)
    plt.errorbar(num_notes, read_means, yerr=read_std, 
                 marker='s', label='Lettura (ms)', linewidth=2, capsize=5)
    plt.errorbar(num_notes, remove_means, yerr=remove_std, 
                 marker='^', label='Eliminazione (ms)', linewidth=2, capsize=5)
    
    plt.xlabel('Numero di Note', fontsize=12, fontweight='bold')
    plt.ylabel('Tempo (ms)', fontsize=12, fontweight='bold')
    plt.title('Performance DKeeper - Tutte le Operazioni', fontsize=14, fontweight='bold')
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.xscale('log')
    plt.tight_layout()
    
    output_path = Path(__file__).parent / 'results' / 'performance_chart.png'
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✅ Grafico salvato: {output_path}")
    
    # Figura 2: Grafico a barre per confronto
    plt.figure(figsize=(12, 7))
    
    x = np.arange(len(num_notes))
    width = 0.25
    
    plt.bar(x - width, create_means, width, label='Creazione', alpha=0.8)
    plt.bar(x, read_means, width, label='Lettura', alpha=0.8)
    plt.bar(x + width, remove_means, width, label='Eliminazione', alpha=0.8)
    
    plt.xlabel('Numero di Note', fontsize=12, fontweight='bold')
    plt.ylabel('Tempo (ms)', fontsize=12, fontweight='bold')
    plt.title('Performance DKeeper - Confronto Operazioni', fontsize=14, fontweight='bold')
    plt.xticks(x, num_notes)
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    
    output_path = Path(__file__).parent / 'results' / 'performance_chart_bars.png'
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✅ Grafico a barre salvato: {output_path}")
    
    # Figura 3: Grafico con dettagli statistici
    plt.figure(figsize=(14, 8))
    
    # Sottografi
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # Creazione
    axes[0, 0].errorbar(num_notes, create_means, yerr=create_std, 
                        marker='o', color='#1f77b4', linewidth=2, capsize=5)
    axes[0, 0].set_title('Creazione Note', fontsize=12, fontweight='bold')
    axes[0, 0].set_ylabel('Tempo (ms)')
    axes[0, 0].grid(True, alpha=0.3)
    
    # Lettura
    axes[0, 1].errorbar(num_notes, read_means, yerr=read_std, 
                        marker='s', color='#ff7f0e', linewidth=2, capsize=5)
    axes[0, 1].set_title('Lettura Note', fontsize=12, fontweight='bold')
    axes[0, 1].set_ylabel('Tempo (ms)')
    axes[0, 1].grid(True, alpha=0.3)
    
    # Eliminazione
    axes[1, 0].errorbar(num_notes, remove_means, yerr=remove_std, 
                        marker='^', color='#2ca02c', linewidth=2, capsize=5)
    axes[1, 0].set_title('Eliminazione Note', fontsize=12, fontweight='bold')
    axes[1, 0].set_xlabel('Numero di Note')
    axes[1, 0].set_ylabel('Tempo (ms)')
    axes[1, 0].grid(True, alpha=0.3)
    
    # Riepilogo statistico
    axes[1, 1].axis('off')
    stats_text = "📊 STATISTICHE\n\n"
    stats_text += "Creazione:\n"
    stats_text += f"  Min: {min(create_means):.4f}ms\n"
    stats_text += f"  Max: {max(create_means):.4f}ms\n"
    stats_text += f"  Media: {np.mean(create_means):.4f}ms\n\n"
    stats_text += "Lettura:\n"
    stats_text += f"  Min: {min(read_means):.4f}ms\n"
    stats_text += f"  Max: {max(read_means):.4f}ms\n"
    stats_text += f"  Media: {np.mean(read_means):.4f}ms\n\n"
    stats_text += "Eliminazione:\n"
    stats_text += f"  Min: {min(remove_means):.4f}ms\n"
    stats_text += f"  Max: {max(remove_means):.4f}ms\n"
    stats_text += f"  Media: {np.mean(remove_means):.4f}ms"
    
    axes[1, 1].text(0.1, 0.5, stats_text, fontsize=11, family='monospace',
                    verticalalignment='center')
    
    fig.suptitle('Performance DKeeper - Analisi Dettagliata', 
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    
    output_path = Path(__file__).parent / 'results' / 'performance_chart_detailed.png'
    fig.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✅ Grafico dettagliato salvato: {output_path}")
    
    # Stampa risultati
    print("\n📈 RISULTATI:\n")
    print("Numero Note | Creazione (ms) | Lettura (ms) | Eliminazione (ms)")
    print("-" * 60)
    for i, n in enumerate(num_notes):
        print(f"{n:>11} | {create_means[i]:>14.4f} | {read_means[i]:>12.4f} | {remove_means[i]:>17.4f}")

def main():
    print("🔄 Caricamento risultati...")
    results = load_results()
    
    print(f"✅ Caricati {len(results)} risultati\n")
    
    aggregated = aggregate_results(results)
    
    print("📊 Creazione grafici...\n")
    create_charts(aggregated)
    
    print("\n✨ Fatto!")

if __name__ == "__main__":
    main()
