from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.pagesizes import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import datetime
from .models import Trip, LogEntry
from django.utils.timezone import localtime


def round_to_nearest_half_hour(dt):
    """Rounds a datetime object to the nearest half-hour."""
    minute = dt.minute
    if minute < 15:
        return dt.replace(minute=0, second=0, microsecond=0)
    elif minute < 45:
        return dt.replace(minute=30, second=0, microsecond=0)
    else:
        return (dt + datetime.timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)


def generate_log_sheet(request):
    trip_id = request.GET.get("trip_id")
    if not trip_id:
        return HttpResponse("Trip ID not provided", status=400)

    try:
        trip = Trip.objects.get(pk=trip_id)
    except Trip.DoesNotExist:
        return HttpResponse("Trip not found", status=404)

    logs = LogEntry.objects.filter(trip=trip).order_by("timestamp")
    # Define custom page size (15 inches wide, 8.5 inches high)
    custom_page_size = (15 * inch, 8.5 * inch)
    # Prepare PDF response
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=driver_log.pdf"
        # Apply custom page size to the document
    doc = SimpleDocTemplate(response, pagesize=custom_page_size)
    elements = []
    styles = getSampleStyleSheet()

    # Header Information
    header_data = [
        ["Date:", trip.date.strftime("%Y-%m-%d"), "Total Miles Driving Today:", str(trip.total_miles or "N/A")],
        ["Name of Carrier:", trip.carrier_name or "N/A", "Truck Number:", trip.truck_number or "N/A"],
        ["Office Address:", trip.office_address or "N/A", "Shipping Documents:", trip.shipping_doc_number or "N/A"],
        ["From:", trip.pickup_location or "N/A", "To:", trip.dropoff_location or "N/A"],
    ]
    # Increased column widths to fit the content better
    header_table = Table(header_data, colWidths=[120, 250, 180, 250])
    header_table.setStyle(TableStyle([  
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold')
    ]))
    
    elements.append(Paragraph("<b>Driver’s Daily Log</b>", styles["Title"]))
    elements.append(Spacer(1, 10))
    elements.append(header_table)
    elements.append(Spacer(1, 12))

    # **24-Hour Grid**
    time_labels = ["Midnight"] + [f"{i}:00" for i in range(1, 12)] + ["Noon"] + [f"{i}:00" for i in range(13, 24)] + ["Midnight"]
    duty_rows = ["1. Off Duty", "2. Sleeper Berth", "3. Driving", "4. On Duty (Not Driving)"]

    # Initialize empty grid
    graph_data = [["Time"] + time_labels]
    grid_data = {
        "1. Off Duty": [" "] * 25,
        "2. Sleeper Berth": [" "] * 25,
        "3. Driving": [" "] * 25,
        "4. On Duty (Not Driving)": [" "] * 25,
    }

    # **Map Log Entries to Grid**
    for log in logs:
        local_time = localtime(log.timestamp)
        rounded_time = round_to_nearest_half_hour(local_time)  # Round to nearest half-hour
        hour = rounded_time.hour
        index = hour if hour < 12 else hour - 12 + 13  # Convert to 24-hour format for grid

        # Get the correct row
        row_map = {
            "Off Duty": "1. Off Duty",
            "Sleeper Berth": "2. Sleeper Berth",
            "Driving": "3. Driving",
            "On Duty (Not Driving)": "4. On Duty (Not Driving)",
        }
        row_key = row_map.get(log.status, "1. Off Duty")  # Default to Off Duty

        # Mark the grid
        grid_data[row_key][index] = "▬"  # Draw line

    # Append rows to the graph data
    for row_name in duty_rows:
        graph_data.append([row_name] + grid_data[row_name])

    graph_table = Table(graph_data, colWidths=[150] + [30] * 25)  # Adjusted colWidths
    graph_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        
        # Color coding for duty status
        ('BACKGROUND', (1, 1), (-1, -1), colors.white),  # Default to white
        ('TEXTCOLOR', (1, 1), (-1, -1), colors.black),
    ]))

    # Color rows based on duty status
    duty_status_colors = {
        "1. Off Duty": colors.green,
        "2. Sleeper Berth": colors.blue,
        "3. Driving": colors.red,
        "4. On Duty (Not Driving)": colors.yellow,
    }

    for row_idx, row_name in enumerate(duty_rows, 1):
        for col_idx in range(1, 26):  # For each hour cell
            if graph_data[row_idx][col_idx] == "▬":
                graph_table.setStyle(TableStyle([
                    ('BACKGROUND', (col_idx, row_idx), (col_idx, row_idx), duty_status_colors.get(row_name, colors.white))
                ]))

    elements.append(Paragraph("<b>Graph Grid</b> (Mark your duty status)", styles["Heading2"]))
    elements.append(graph_table)
    elements.append(Spacer(1, 12))

    # **Legend for Colors**
    legend_data = [
        ["Off Duty", "Green"],
        ["Sleeper Berth", "Blue"],
        ["Driving", "Red"],
        ["On Duty (Not Driving)", "Yellow"],
    ]
    legend_table = Table(legend_data, colWidths=[200, 100])
    legend_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))

    elements.append(Spacer(1, 12))
    elements.append(Paragraph("<b>Legend for Colors</b>", styles["Heading3"]))
    elements.append(legend_table)
    elements.append(Spacer(1, 12))

    # **Log Entries Table**
    log_table_data = [["Time", "Status", "Location", "Remarks"]]
    for log in logs:
        local_time = localtime(log.timestamp).strftime("%I:%M %p")  # Format time
        log_table_data.append([local_time, log.status, log.location, log.remarks or ""])

    log_table = Table(log_table_data, colWidths=[100, 150, 250, 300])  # Adjusted column widths
    log_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (0, 0), colors.lightgrey),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold')
    ]))

    elements.append(Paragraph("<b>Log Entries</b>", styles["Heading2"]))
    elements.append(log_table)
    elements.append(Spacer(1, 12))

    # **Signatures**
    elements.append(Paragraph(f"<b>Driver’s Initials:</b> {trip.driver_initials}", styles["Normal"]))
    elements.append(Paragraph("<b>Driver’s Signature:</b> ________________________", styles["Normal"]))
    elements.append(Spacer(1, 10))

    doc.build(elements)
    return response
