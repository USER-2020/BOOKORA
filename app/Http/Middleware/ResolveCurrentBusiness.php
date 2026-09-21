<?php

namespace App\Http\Middleware;

use App\Models\Business;
use App\Support\CurrentBusiness;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveCurrentBusiness
{
    public function handle(Request $request, Closure $next): Response
    {
        app(CurrentBusiness::class)->clear();
        $business = $request->route('business');

        if ($business instanceof Business) {
            app(CurrentBusiness::class)->set($business);
        } elseif ($request->user()) {
            $businessId = $request->session()->get('active_business_id');
            $business = $request->user()->businesses()
                ->when($businessId, fn ($query) => $query->whereKey($businessId))
                ->first();

            if ($business) {
                app(CurrentBusiness::class)->set($business);
                $request->session()->put('active_business_id', $business->id);
            }
        }

        return $next($request);
    }
}
