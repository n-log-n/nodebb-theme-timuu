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

function publish(e) {
    e.preventDefault();
    // var media_type = ajaxify.data.title == 'TV Shows' ? 'tv' : 'movie';
    var media_type = $(this).find("input[name=media_type]").val();
    var media_id = $(this).find("input[name=media_id]").val();
    
    if (media_id) {
        $.ajax({
            url: '/discussimdb/category',
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
};

function queryMedia(query, cb) {

    $.ajax({
        url: '/discussimdb/search/' + query,
        type: 'GET',
        success: function(result) {
            var cnt = 0;
            
            results = result.results;

            for (var index in results) {
                media = results[index];

                var title = media.title;
                var year = '1947';
                var media_label = 'Movie';
                var icon = 'film';
                var poster = media.poster_path

                if (media.media_type == 'tv') {
                    year = new Date(media.first_air_date).getFullYear();
                    media_label = 'TV Show';
                    icon = 'television';
                    title = media.original_name + ' ( ' + year + ' )';
                } else if (media.media_type == 'movie') {
                    year = new Date(media.release_date).getFullYear();
                    title = media.title + ' ( ' + year + ' )';
                } else {
                    title = media.name;
                    media.overview = ''
                    poster = media.profile_path
                    year = ''
                    media_label = 'Person';
                    icon = 'users';
                }

                if (! poster) continue;

                media.title = title;
                media.year = year;
                media.media_label = media_label;
                media.icon = icon;
                media.poster = poster;
                
                results[cnt] = media;
                cnt = cnt + 1;
            }

            results = results.slice(0, Math.min(4, cnt)).reverse();
            console.log(results);
            cb && cb(null, results);
        },
        error: function(error) {
            console.log(`Error ${error}`);
            cb && cb(error);
        }
    }).catch(function(err) {
        console.log(err);
    });
}

function advanceSearch() {

    // $('#search-fields').removeClass('hidden');

    const path = window.location.pathname || ''
    if (path.indexOf('search') == -1) return;

    var searchInput = $('#search-input').val();
    var resultsRow = $('#results').parent();
    var mediaResults = $('#results-discussimdb');

    if (mediaResults.length > 0) return;

    if (! searchInput) return;

    queryMedia(searchInput, function(err, result) {
        if (err || !results || results.length <= 0) return;

        var searchResults = '<div id="results-discussimdb" class="col-md-12">';
        searchResults += '<div class="alert alert-info">Top Matching Movies/TV Shows </div>'

        var events = [];

        results.reverse().forEach(function(media) {
            searchResults += `
                <div component="categories/category" data-cid="8" data-numrecentreplies="1" class="col-md-3 kralahmet">
                    <div class="kralahmet-container">
                        <meta itemprop="name" content="Inception">
                        <div class="kralahmet-bg" style="background-color: #DC9656; color: #fff; background-image: url(http://image.tmdb.org/t/p/w342/${media.poster}); background-size: cover;"></div>
                        <div class="content sicakhavalar">
                            <a href='#' id="media_link_${media.id}">
                                <input type="hidden" name="media_id" value="${media.id}">
                                <input type="hidden" name="media_type" value="${media.media_type}">
                                <h2 class="title">
                                    ${media.title}
                                </h2>      
                            </a>
                        </div>
                    </div>
                </div>
            `;

            events.push(`a#media_link_${media.id}`);

        });

        searchResults += '</div>';

        resultsRow.prepend(searchResults);

        events.forEach(element => {
            $(element).on('click', publish);
        });

    });

}

$(document).ready(advanceSearch);
$(window).on('action:ajaxify.end', advanceSearch);

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
            if (! searchInput.val()) return;
            
            queryMedia(searchInput.val(), function(err, results) {
                if (err) return;
                if (results && searchInput.is(':focus')) {
                    results.forEach(function(media) {

                        snippet = utils.escapeHTML(media.overview.slice(0, 80) + '...');

                        quickSearchResults.prepend(`
                            <li style='min-width:350px'>
                                <a href='#' id="media_link_${media.id}">
                                    <input type="hidden" name="media_id" value="${media.id}">
                                    <input type="hidden" name="media_type" value="${media.media_type}">
                                    <span class="quick-search-title" style="margin-bottom:10px;">
                                            ${media.title} 
                                    </span>
                                    <img src="http://image.tmdb.org/t/p/w92/${media.poster}"  style='float: left; margin-right:15px; widht=15%' alt="title" id="itemImg">
                                    <br>
                                    <p class="snippet">
                                        ${snippet}
                                    </p>
                                    <small class="post-info pull-right">
                                        <i class="fa fa-${media.icon}" aria-hidden="true"> ${media.media_label}</i>
                                    </small>
                                </a>
                            </li>
                            <li role="separator" class="divider"></li>
                        `);

                        $(`a#media_link_${media.id}`).on('click', publish);
                    });

                    if (results.length > 0) {
                        quickSearchResults.removeClass('hidden').show();
                    }
                }
            });
        }, 200);
    });

});

