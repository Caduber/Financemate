// Função para agrupar dados por mês (0 = jan, 11 = dez)
function agruparPorMes(dados) {
    let meses = new Array(12).fill(0);
    dados.forEach(item => {
        // Supondo que item.data esteja em formato ISO (YYYY-MM-DD) ou similar.
        let data = new Date(item.data);
        let mes = data.getMonth(); // retorna um valor de 0 a 11
        let valor = parseFloat(item.valor);
        if (!isNaN(valor)) {
            meses[mes] += valor;
        }
    });
    return meses;
}
