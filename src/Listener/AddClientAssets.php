<?php

namespace Sledov\Quill\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Frontend\Event\Rendering;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Rendering::class, [$this, 'addAssets']);
    }

    public function addAssets(Rendering $event)
    {
        if ($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/../../js/forum/dist/extension.js',
                __DIR__ . '/../../less/quill.snow.less',
                __DIR__ . '/../../less/custom.less'
            ]);
            $event->addBootstrapper('sledov/quill/main');
        }
    }
}
