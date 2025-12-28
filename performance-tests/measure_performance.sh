#!/bin/bash

# Script per misurare le performance usando dfx invoke
# Salva i risultati in performance_results.csv

OUTPUT_FILE="./results/performance_results.csv"

# Header
echo "numero_note,iterazione,creazione_ms,lettura_ms,eliminazione_ms,timestamp" > "$OUTPUT_FILE"

# Configurazione
TEST_SIZES=(10 25 50 100)
ITERATIONS=5

echo "🚀 Inizio test di performance con dfx invoke..."
echo

# ID univoco per il test
TEST_ID=$(date +%s%N)
echo "📍 Test ID: $TEST_ID"
echo

# Funzione per pulire tutte le note
cleanup_notes() {
    echo "🧹 Pulizia canister..."
    
    # Loop: elimina sempre il primo (indice 0) finché ce ne sono
    while true; do
        # Controlla se ci sono note
        NOTES_COUNT=$(dfx canister call dkeeper_backend readNotes '()' 2>/dev/null | grep -c "record")
        
        if [ "$NOTES_COUNT" -eq 0 ]; then
            echo "   ✓ Canister vuoto"
            break
        fi
        
        # Elimina il primo elemento
        dfx canister call dkeeper_backend removeNote "(0)" > /dev/null 2>&1
    done
}

# Pulizia iniziale
echo "🔧 Pulizia iniziale del canister..."
cleanup_notes
echo

# WARM-UP: Scalda il sistema (non misurato)
echo "🔥 Warm-up del canister..."
WARMUP_SIZE=100
for ((i=0; i<WARMUP_SIZE; i++)); do
    dfx canister call dkeeper_backend createNote "(\"warmup_$i\", \"warmup\")" > /dev/null 2>&1
done
echo "   ✓ Create $WARMUP_SIZE note di riscaldamento"

dfx canister call dkeeper_backend readNotes '()' > /dev/null 2>&1
echo "   ✓ Lettura eseguita (GC scattato)"

# Warm-up eliminazione
for ((i=0; i<WARMUP_SIZE; i++)); do
    dfx canister call dkeeper_backend removeNote "(0)" > /dev/null 2>&1
done
echo "   ✓ Eliminazione eseguita"

cleanup_notes
echo "   ✓ Canister pulito e pronto"
echo

for NUM_NOTES in "${TEST_SIZES[@]}"; do
    echo "📊 Test con $NUM_NOTES note..."
    
    for ((iter=1; iter<=ITERATIONS; iter++)); do
        echo "  ⏱️  Iterazione $iter/$ITERATIONS"
        
        # Pulizia prima di ogni iterazione (memoria fresca)
        cleanup_notes
        
        # CREAZIONE
        echo "     → Creazione di $NUM_NOTES note..."
        START=$(date +%s%N)
        for ((i=0; i<NUM_NOTES; i++)); do
            dfx canister call dkeeper_backend createNote "(\"Test_${TEST_ID}_Note_$i\", \"Content $i\")" > /dev/null 2>&1
            if [ $((i % 10)) -eq 0 ] && [ $i -gt 0 ]; then
                echo "       ✓ Create $i/$NUM_NOTES"
            fi
        done
        END=$(date +%s%N)
        CREATE_TIME=$(echo "scale=4; ($END - $START) / 1000000 / $NUM_NOTES" | bc)
        echo "     ✅ Creazione media: ${CREATE_TIME}ms per nota"
        
        # LETTURA
        echo "     → Lettura delle note..."
        START=$(date +%s%N)
        dfx canister call dkeeper_backend readNotes '()' > /dev/null 2>&1
        END=$(date +%s%N)
        READ_TIME=$(echo "scale=4; ($END - $START) / 1000000" | bc)
        echo "     ✅ Lettura: ${READ_TIME}ms"
        
        # ELIMINAZIONE
        echo "     → Eliminazione di $NUM_NOTES note..."
        START=$(date +%s%N)
        for ((i=0; i<NUM_NOTES; i++)); do
            dfx canister call dkeeper_backend removeNote "(0)" > /dev/null 2>&1
            if [ $((i % 10)) -eq 0 ] && [ $i -gt 0 ]; then
                echo "       ✓ Eliminate $i/$NUM_NOTES"
            fi
        done
        END=$(date +%s%N)
        REMOVE_TIME=$(echo "scale=4; ($END - $START) / 1000000 / $NUM_NOTES" | bc)
        echo "     ✅ Eliminazione media: ${REMOVE_TIME}ms per nota"
        
        # Salva il risultato
        TIMESTAMP=$(date -Iseconds)
        echo "$NUM_NOTES,$iter,$CREATE_TIME,$READ_TIME,$REMOVE_TIME,$TIMESTAMP" >> "$OUTPUT_FILE"
        
        echo
    done
    echo
done

echo "✅ Test completato!"
echo "📁 Risultati salvati in: $OUTPUT_FILE"
echo

# Pulizia finale
cleanup_notes

echo "📈 Genera il grafico con:"
echo "   /tmp/dkeeper_env/bin/python3 generate_chart.py"
