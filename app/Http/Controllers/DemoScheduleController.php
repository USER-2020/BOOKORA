<?php

namespace App\Http\Controllers;

use App\Models\DemoRequest;
use App\Services\WhatsAppNotifier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DemoScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $demoRequest = DemoRequest::with('business')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        abort_unless($demoRequest, 404);

        return Inertia::render('DemoSchedule', [
            'demoRequest' => $demoRequest,
            'timezone' => config('app.timezone'),
        ]);
    }

    public function store(Request $request, WhatsAppNotifier $notifier): RedirectResponse
    {
        $validated = $request->validate([
            'scheduled_at' => ['required', 'date', 'after:now'],
            'attendee_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $demoRequest = DemoRequest::where('user_id', $request->user()->id)->latest()->firstOrFail();
        $scheduledAt = Carbon::parse($validated['scheduled_at'], config('app.timezone'));

        if ($scheduledAt->minute % 30 !== 0) {
            throw ValidationException::withMessages(['scheduled_at' => 'Selecciona una hora en punto o a los 30 minutos.']);
        }

        $demoRequest->update([
            'scheduled_at' => $scheduledAt,
            'attendee_message' => $validated['attendee_message'] ?? null,
            'status' => 'scheduled',
            'whatsapp_status' => 'pending',
        ]);
        $notifier->sendDemoReservation($demoRequest->fresh('business'));

        return back()->with('success', 'Tu demo quedó agendada. Te contactaremos para confirmarla.');
    }
}
