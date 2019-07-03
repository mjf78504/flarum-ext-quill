<?php

namespace Sledov\Quill\Listener;

use Flarum\Formatter\Event\Configuring;
use Illuminate\Contracts\Events\Dispatcher;

class FormatHtml
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Configuring::class, [$this, 'addHtmlFormatter']);
    }

    /**
     * @param Configuring $event
     */
    public function addHtmlFormatter(Configuring $event)
    {
        $configurator = $event->configurator;

        $configurator->rootRules->disableAutoLineBreaks();

        $htmlElements = array(
            'p',
            'br',
            'a',
            'b',
            'strong',
            'i',
            'em',
            'u',
            'h2',
            'h3',
            'ul',
            'ol',
            'li',
            'h1',
            'img'
        );

        foreach ($htmlElements as $el) {
            $configurator->HTMLElements->allowElement($el);
        }

        $configurator->HTMLElements->allowAttribute('a', 'href');
        $configurator->HTMLElements->allowAttribute('a', 'title');
        
        $configurator->HTMLElements->allowAttribute('img', 'src');
    }
}
