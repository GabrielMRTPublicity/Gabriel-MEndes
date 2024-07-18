// click dos botoes para abrir o popup
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById("vincular_evento");

    btn.onclick = function() {
        loadPopupContent();
    };
});

// Função para abrir o popup e carregar o conteúdo
function loadPopupContent() {
    var modal = document.getElementById("modal-vinculador");
    var xhr = new XMLHttpRequest();
    
    // Adiciona um parâmetro de cache busting à URL
    var url = '../assets/componentes/popup_vinculador.php?v=' + new Date().getTime();
    
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (this.status === 200) {
            modal.innerHTML = this.responseText;
            setupModal();
            loadData();
        } else {
            console.error('Erro ao carregar o conteúdo: ' + this.status);
        }
    };
    xhr.send();
}
// Função para configurar o popup
function setupModal() {
    var excluir_text = document.getElementById("modal-vinculador");
    var modal = document.getElementById("myModal");
    var closeBtn = document.querySelector('.close');

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            // Limpar o conteúdo dentro do elemento com ID modal-vinculador
            if (excluir_text) {
                excluir_text.innerHTML = "";
            }
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            // Limpar o conteúdo dentro do elemento com ID modal-vinculador
            if (excluir_text) {
                excluir_text.innerHTML = "";
            }
        }
    };

    modal.style.display = "block";
}

// Função para filtrar eventos
function filtro_evento() {
    var filtro = document.getElementById('tipoFiltroEvento');
    filtro.addEventListener('change', function() {
        var tipoSelecionado = this.value.toLowerCase();
        var linhas = document.querySelectorAll('#eventos-tbody .evento-row');

        linhas.forEach(function(linha) {
            var tipoColuna = linha.querySelector('.titulo_col2').textContent.trim().toLowerCase();

            if (tipoSelecionado === 'todos' || tipoColuna === tipoSelecionado) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
}
// Função para filtrar instituições
function filtro_instituicoes() {
    var filtro = document.getElementById('tipoFiltroInsituicoes');
    filtro.addEventListener('change', function() {
        var tipoSelecionado = this.value.toLowerCase();
        var linhas = document.querySelectorAll('#instituicoes-tbody .instituicao-row');

        linhas.forEach(function(linha) {
            var tipoColuna = linha.querySelector('.titulo_col2').textContent.trim().toLowerCase();

            if (tipoSelecionado === 'todos' || tipoColuna === tipoSelecionado) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
}
// Função para carregar o conteúdo do popup e configurar o filtro
function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/php/vinculador.php', true);
    xhr.onload = function() {
        if (this.status === 200) {
            var data = JSON.parse(this.responseText); 
            if (Array.isArray(data.eventos) && Array.isArray(data.instituicoes)) {
                //fillSelect('evento', data.eventos, "Selecione um evento");
                //fillSelect('instituicao', data.instituicoes, "Selecione uma instituição");

                initializeFilterButtons(data.eventos, data.instituicoes);

                var btnMostrarEventos = document.getElementById("mostrar_eventos");
                var btnMostrarInstituicoes = document.getElementById("mostrar_instituicoes");

                btnMostrarEventos.onclick = function() {
                    filtro_evento();
                    initializeEventoClicktable(data.vinculos);
                    toggleActiveClass(btnMostrarEventos, btnMostrarInstituicoes);
                    toggleDisplay('div_evento', 'div_instituicao');
                };

                btnMostrarInstituicoes.onclick = function() {
                    filtro_instituicoes();
                    initializeInstituicaoClicktable(data.vinculos);
                    toggleActiveClass(btnMostrarInstituicoes, btnMostrarEventos);
                    toggleDisplay('div_instituicao', 'div_evento');
                };

                function toggleActiveClass(activeButton, inactiveButton) {
                    activeButton.classList.add('active');
                    if (inactiveButton.classList.contains('active')) {
                        inactiveButton.classList.remove('active');
                    }
                }

                function toggleDisplay(showDivId, hideDivId) {
                    var showDiv = document.getElementById(showDivId);
                    var hideDiv = document.getElementById(hideDivId);

                    hideDiv.classList.remove('show');
                    setTimeout(function() {
                        hideDiv.style.display = 'none';
                    }, 10);

                    showDiv.style.display = 'block';
                    setTimeout(function() {
                        showDiv.classList.add('show');
                    }, 10);
                }
               
                
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao carregar os dados: Não existe Eventos ou Instituições cadastradas',
                });
            }
        } else {
            console.error('Erro ao carregar os dados: ' + this.status);
        }
    };
    xhr.send();
}
// Função para inicializar os botões de filtro
function initializeFilterButtons(eventos, instituicoes) {
    var filtroEscolarBtn = document.getElementById('filtro-escolar');
    var filtroOutrosBtn = document.getElementById('filtro-outros');

    filtroEscolarBtn.addEventListener('click', function() {
        applyFilter('Escolar', eventos, instituicoes);
        toggleActiveClass(filtroEscolarBtn, filtroOutrosBtn);
    });

    filtroOutrosBtn.addEventListener('click', function() {
        applyFilter('Outros', eventos, instituicoes);
        toggleActiveClass(filtroOutrosBtn, filtroEscolarBtn);
    });

    function toggleActiveClass(activeButton, inactiveButton) {
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
    }
}
// Função para aplicar o filtro e atualizar os selects
function applyFilter(filtro, eventos, instituicoes) {
    var escolarValues = ['1', '2', '3', '4'];

    var filteredEventos = eventos.filter(function(evento) {
        var check_obsValues = evento.check_obs.split(',');
        if (filtro === 'Escolar') {
            // Verifica se todos os valores do check_obs estão dentro de escolarValues e não contêm '0'
            return check_obsValues.every(value => escolarValues.includes(value)) && !check_obsValues.includes('0');
        } else if (filtro === 'Outros') {
            // Verifica se check_obs contém '0'
            return check_obsValues.includes('0');
        }
        return false;
    });

    var filteredInstituicoes = instituicoes.filter(function(instituicao) {
        var check_obsValues = instituicao.check_obs.split(',');
        if (filtro === 'Escolar') {
            // Verifica se todos os valores do check_obs estão dentro de escolarValues e não contêm '0'
            return check_obsValues.every(value => escolarValues.includes(value)) && !check_obsValues.includes('0');
        } else if (filtro === 'Outros') {
            // Verifica se check_obs contém '0'
            return check_obsValues.includes('0');
        }
        return false;
    });

    // Refinar instituições com base nos eventos filtrados
    var finalFilteredInstituicoes = filteredInstituicoes.filter(function(instituicao) {
        var instituicaoObsValues = instituicao.check_obs.split(',');
        return filteredEventos.some(function(evento) {
            var eventoObsValues = evento.check_obs.split(',');
            return eventoObsValues.some(value => instituicaoObsValues.includes(value));
        });
    });

    // Refinar eventos com base nas instituições filtradas
    var finalFilteredEventos = filteredEventos.filter(function(evento) {
        var eventoObsValues = evento.check_obs.split(',');
        return finalFilteredInstituicoes.some(function(instituicao) {
            var instituicaoObsValues = instituicao.check_obs.split(',');
            return eventoObsValues.some(value => instituicaoObsValues.includes(value));
        });
    });

    console.log('Filtered Eventos:', finalFilteredEventos);
    console.log('Final Filtered Instituicoes:', finalFilteredInstituicoes);

    if (filtro === 'Escolar'){
        fillSelect('evento', finalFilteredEventos, "Selecione um evento Escolar");
        fillSelect('instituicao', finalFilteredInstituicoes, "Selecione uma instituição Escolar");
    } else {
        fillSelect('evento', finalFilteredEventos, "Selecione um evento");
        fillSelect('instituicao', finalFilteredInstituicoes, "Selecione uma instituição");
    }
}





// Função para preencher os selects com uma opção genérica
function fillSelect(selectId, items, defaultText) {
    var select = document.getElementById(selectId);
    if (!select) {
        console.error('Elemento select não encontrado:', selectId);
        return;
    }
    select.innerHTML = '';

    // Adiciona a opção genérica
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    select.appendChild(defaultOption);

    // Adiciona as opções dinâmicas
    items.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.ID;
        option.textContent = item.Título;
        select.appendChild(option);
    });
}

function initializeFilter(vinculos) {
    var filtroTipo = 'Escolar';

    function populateDropdowns() {
        var eventoSelect = document.getElementById('evento');
        var instituicaoSelect = document.getElementById('instituicao');
        eventoSelect.innerHTML = '';
        instituicaoSelect.innerHTML = '';

        var eventosAdicionados = {};
        vinculos.forEach(function(vinculo) {
            var tipoEvento = vinculo['evento_check_obs'].split(',').includes('0') ? 'Outros' : 'Escolar';
            var tipoInstituicao = vinculo['instituicao_check_obs'].split(',').includes('0') ? 'Outros' : 'Escolar';

            if (filtroTipo === tipoEvento && filtroTipo === tipoInstituicao) {
                if (!eventosAdicionados[vinculo['id_eventos']]) {
                    var eventoOption = document.createElement('option');
                    eventoOption.value = vinculo['id_eventos'];
                    eventoOption.textContent = vinculo['evento_titulo'];
                    eventoSelect.appendChild(eventoOption);
                    eventosAdicionados[vinculo['id_eventos']] = true;
                }

                var instituicaoOption = document.createElement('option');
                instituicaoOption.value = vinculo['id_instituicoes'];
                instituicaoOption.textContent = vinculo['instituicao_titulo'];
                instituicaoSelect.appendChild(instituicaoOption);
            }
        });
    }

    document.getElementById('filtro-escolar').addEventListener('click', function() {
        filtroTipo = 'Escolar';
        populateDropdowns();
    });

    document.getElementById('filtro-outros').addEventListener('click', function() {
        filtroTipo = 'Outros';
        populateDropdowns();
    });

    // Inicializar os dropdowns na primeira carga
    populateDropdowns();
}
// Função para inicializar os eventos de clique nas linhas da tabela de eventos
function initializeEventoClicktable(vinculos) {
    var eventoRows = document.querySelectorAll('.evento-row');

    eventoRows.forEach(function(row) {
        row.addEventListener('click', function() {
            var eventoId = this.getAttribute('data-evento-id');
            mostrarInstituicoes(eventoId, vinculos);

            // Remover a classe 'active' de todas as linhas
            eventoRows.forEach(function(r) {
                r.classList.remove('active');
            });

            // Adicionar a classe 'active' à linha clicada
            this.classList.add('active');
        });
    });
}
// Função para inicializar os eventos de clique nas linhas da tabela de instituições
function initializeInstituicaoClicktable(vinculos) {
    var instituicaoRows = document.querySelectorAll('.instituicao-row');

    instituicaoRows.forEach(function(row) {
        row.addEventListener('click', function() {
            var instituicaoId = this.getAttribute('data-instituicao-id');
            mostrarEventos(instituicaoId, vinculos);

            // Remover a classe 'active' de todas as linhas
            instituicaoRows.forEach(function(r) {
                r.classList.remove('active');
            });

            // Adicionar a classe 'active' à linha clicada
            this.classList.add('active');
        });
    });
}
// Função para mostrar os eventos vinculados à instituição selecionada
function mostrarEventos(instituicaoId, vinculos) {
    var eventosTable = document.getElementById('mostrar-eventos-table');
    eventosTable.style.display = 'none';

    var eventosTbody = document.getElementById('mostrar-eventos-tbody');
    eventosTbody.innerHTML = '';

    vinculos.forEach(function(vinculo) {
        if (vinculo.id_instituicoes == instituicaoId) {
            var row = document.createElement('tr');
            var idEventoCell = document.createElement('td');
            var tituloEventoCell = document.createElement('td');

            idEventoCell.textContent = vinculo.id_eventos;
            tituloEventoCell.textContent = vinculo.evento_titulo;

            row.appendChild(idEventoCell);
            row.appendChild(tituloEventoCell);

            eventosTbody.appendChild(row);
        }
    });

    eventosTable.style.display = 'table';
}
// Função para mostrar as instituições vinculadas ao evento selecionado
function mostrarInstituicoes(eventoId, vinculos) {
    var instituicoesTable = document.getElementById('mostrar-instituicoes-table');
    instituicoesTable.style.display = 'none';

    var instituicoesTbody = document.getElementById('mostrar-instituicoes-tbody');
    instituicoesTbody.innerHTML = '';

    vinculos.forEach(function(vinculo) {
        if (vinculo.id_eventos == eventoId) {
            var row = document.createElement('tr');
            var idInstituicaoCell = document.createElement('td');
            var tituloInstituicaoCell = document.createElement('td');

            idInstituicaoCell.textContent = vinculo.id_instituicoes;
            tituloInstituicaoCell.textContent = vinculo.instituicao_titulo;

            row.appendChild(idInstituicaoCell);
            row.appendChild(tituloInstituicaoCell);

            instituicoesTbody.appendChild(row);
        }
    });

    instituicoesTable.style.display = 'table';
}
// Adiciona evento para o botão de adicionar e remover vínculo
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'add_vinculo') {
            handleVinculo('add');
        }
    });
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'remover_vinculo') {
            handleVinculo('remove');
        }
    });
});
//ação dos botoes de adicionar e remover
function handleVinculo(action) {
    var eventoId = document.getElementById('evento').value;
    var instituicaoId = document.getElementById('instituicao').value;

    if (!eventoId || !instituicaoId) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Por favor, selecione um evento e uma instituição.',
            confirmButtonColor: '#f8bb86'
        });
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../assets/php/vinculador.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (this.status === 200) {
            try {
                var response = JSON.parse(this.responseText);
                Swal.fire({
                    icon: response.success ? 'success' : 'error',
                    title: response.success ? 'Sucesso' : 'Erro',
                    confirmButtonColor: '#5bce1a',
                    text: response.message,
                    confirmButtonColor: response.success ? '#5bce1a' : '#d33'
                }).then(() => {
                    if (response.success) {
                        window.location.reload();
                    }
                });
            } catch (e) {
                console.error('Erro ao analisar a resposta JSON: ', e);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao processar a resposta do servidor.',
                });
            }
        } else {
            console.error('Erro ao processar a requisição: ' + this.status);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao processar a requisição.',
            });
        }
    };

    var params = 'action=' + action + '&evento_id=' + eventoId + '&instituicao_id=' + instituicaoId;
    xhr.send(params);
}