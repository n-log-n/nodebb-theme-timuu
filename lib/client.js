/*
	Hey there!

	This is the client file for your theme. If you need to do any client-side work in javascript,
	this is where it needs to go.

	You can listen for page changes by writing something like this:

	  $(window).on('action:ajaxify.end', function(data) {
		var	url = data.url;
		console.log('I am now at: ' + url);
	  });
*/

'use strict';

$(document).ready(function() { 
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    
    var media_type = ajaxify.data.title == 'TV Shows' ? 'tv' : 'movie';

    var params = [];
    for (var i = 0; i < queries.length; i++)
    {
        kv = queries[i].split('=');
        params.push(kv[0]);
        params[kv[0]] = kv[1];
    }

    if ('owner' in params && 'title' in params && 'poster' in params) {
        app.alert({
            title: params['title'],
            message: `We just added ${params['title']} to this forum. We need your help to improve its contents`,
            location: 'left-bottom',
            timeout: 9500,
            type: 'success',
            image: 'http://image.tmdb.org/t/p/w92' + params['poster']
        });
        
    }

    // var targetNodes = $('#content');
    // var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    // var myObserver = new MutationObserver(mutationHandler);
    // var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };
    // targetNodes.each ( function () {
    //     myObserver.observe (this, obsConfig);
    // } );
    
    // function mutationHandler (mutationRecords) {
    //     if (ajaxify.data.title == 'TV Shows' || ajaxify.data.title == 'Movies') {
    //         $('#media_search_btn').show();
    //     } else {
    //         $('#media_search_btn').hide();
    //     }

    // }

    
    // function formatResults(results) {
    //     var media_type = ajaxify.data.title == 'TV Shows' ? 'tv' : 'movie';
    //     var count = 0;
    //     var elements = '<div class="row card-container">';
    //     $.each(results, function(idx, obj) {
            
    //         var title = obj.title
    //         var year = '1947';
    //         if (media_type == 'tv') {
    //             title = obj.original_name;
    //             year = new Date(obj.first_air_date).getFullYear();
    //         } else {
    //             year = new Date(obj.release_date).getFullYear();
    //         }
    //         if (title.length > 15)
    //             title = title.substring(0, 15) + "...";

    //         var html = `
    //             <div class="col-md-3 col">
    //                 <div class="card">
    //                     <a href="javascript:void(0)" class="media_link">
    //                     <input type="hidden" name="media_id" value="${obj.id}">
    //                     <img src="http://image.tmdb.org/t/p/w185/${obj.poster_path}" alt="Avatar">
    //                     <div class="media-content">
    //                         <h4> ${title} </h4>
    //                         <p> <b>${year} </b> </p>
    //                     </div></a>
    //                 </div>
    //             </div>
    //         `;

    //         if (count != 0 && count % 4 == 0 ) 
    //             elements += '</div><div class="row">'
            
    //         elements += html;
            
    //         count++;
    //     });

    //     if (count != 0 && count % 4 != 0 )
    //         elements += '</div>';
        
    //     return elements;
    // }

    // function queryMedia() {
    //     var media_type = ajaxify.data.title == 'TV Shows' ? 'tv' : 'movie';
        
    //     var query = $('#media_modal_input').val().trim();
    //     if (!query) return;
        
    //     // Make a search request to server.
    //     $.ajax({
    //         url: '/discussimdb/search/' + media_type + '/' + query,
    //         type: 'GET',
    //         success: function(result) {
    //             console.log(result.results);
    //             if (result.results)
    //                 $('.media_search_class').html(formatResults(result.results));
                
    //         },
    //         error: function(error) {
    //             console.log(`Error ${error}`);
    //         }
    //     });
    // }

    // $('body').on('click', '#media_search_go', function(e) {
    //     queryMedia();
    // });
    
    // $('body').on('keyup', '#media_modal', function(e) {
    //     if (event.keyCode == 13) {
    //         queryMedia();
    //     }
    // });

    $('body').on('click', 'a.media_link', function(e) {
        e.preventDefault();
        // var media_type = ajaxify.data.title == 'TV Shows' ? 'tv' : 'movie';
        var media_type = $(this).find("input[name=media_type]").val();
        var media_id = $(this).find("input[name=media_id]").val();

        console.log(media_type);
        console.log(media_id);
        console.log("Click");
        
        if (media_id) {
            $.ajax({
                url: '/discussimdb/category/add',
                type: 'POST',
                data : {'media_id' : media_id, 'media_type': media_type},
                success: function(result) {
                    if (result.slug) {
                        params = ''
                        if (result.owner) {
                            params = `?owner=1&title=${result.title}&poster=${result.poster_path}`;
                        }
                        window.location.href = "/category/" + result.slug + params;
                    }
                },
                error: function(xhr, status, error) {
                    app.alert({
                        title: 'Error',
                        message: xhr.responseText,
                        location: 'left-bottom',
                        timeout: 5000,
                        type: 'error',
                    });
                }
            });
        }
    });

    // Code for injecting movie's search into nodebb

    var searchTimeoutId = 0;

    var searchButton = $('#search-button');
    var searchFields = $('#search-fields');
    var searchInput = $('#search-fields input');
    var quickSearchResults = $('#quick-search-results');


    searchInput.on('keyup', function(e) {

        if (searchTimeoutId) {
            clearTimeout(searchTimeoutId);
            searchTimeoutId = 0;
        }

        if (searchInput.val().length < 3) {
            return;
        }

        searchTimeoutId = setTimeout(function() {
            $.ajax({
                url: '/discussimdb/search2/' + searchInput.val(),
                type: 'GET',
                success: function(result) {
                    if (result.results && searchInput.is(':focus')) {
                        results = result.results.slice(0, 4).reverse();

                        var count = 0;

                        results.forEach(function(media) {

                            var title = media.title;
                            var year = '1947';
                            var media_label = 'Movie';
                            var icon = 'film';

                            if (! media.poster_path) return;

                            if (media.media_type == 'tv') {
                                title = media.original_name;
                                year = new Date(media.first_air_date).getFullYear();
                                media_label = 'TV Show';
                                icon = 'television';
                            } else if (media.media_type == 'movie') {
                                year = new Date(media.release_date).getFullYear();
                            } else {
                                return;
                            }
                            
                            snippet = utils.escapeHTML(media.overview.slice(0, 80) + '...');

                            quickSearchResults.prepend(`
                                <li>
                                    <a href="javascript:void(0)" class="media_link">
                                        <input type="hidden" name="media_id" value="${media.id}">
                                        <input type="hidden" name="media_type" value="${media.media_type}">
                                        <span class="quick-search-title" style="margin-bottom:10px;">
                                            ${title} (<b>${year}</b>)
                                        </span>
                                        <img src="http://image.tmdb.org/t/p/w92/${media.poster_path}"  style='float: left; margin-right:15px; widht=15%' alt="title" id="itemImg">
                                        <br>
                                        <p class="snippet">
                                            ${snippet}
                                        </p>
                                        <small class="post-info pull-right">
                                            <i class="fa fa-${icon}" aria-hidden="true"> ${media_label}</i>
                                        </small>
                                    </a>
                                </li>
                                <li role="separator" class="divider"></li>
                            `);

                        });

                        if (results.length > 0) {
                            quickSearchResults.removeClass('hidden').show();
                        }
                        

                    }
                    
                },
                error: function(error) {
                    console.log(`Error ${error}`);
                }
            });
            
        }, 300);

    });

});

