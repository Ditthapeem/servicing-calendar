from time import time
from .models import Customer, Reservation
from datetime import datetime, timedelta
# from django.core.mail import send_mail
# from servicing_calendar.settings import EMAIL_HOST_USER

BREAK = 30
WEEK = 6
OPEN = datetime.strptime('08-00-00', '%H-%M-%S')
OPEN_END = datetime.strptime('09-00-00', '%H-%M-%S')
CLOSE = datetime.strptime('19-00-00', '%H-%M-%S')
CLOSE_END = datetime.strptime('20-00-00', '%H-%M-%S')
LIST_OF_BREAK = [   OPEN.time(),
                    OPEN_END.time(),
                    CLOSE.time(),
                    CLOSE_END.time()
                ]

def insert_break_time(pre_list):
    """
    A list of open, lunch, close time.

    Args:
        pre_list: A list that we need to insert time.
    Returns:
        A single list of break time.
    """
    for time in LIST_OF_BREAK:
        pre_list.append(time)
    return pre_list

def minute_interval(start, end):
    """
    Give a different of minutes of two time

    Args:
        start: A start time in datetime.time().
        end: A end time in datetime.time().

    Returns:
        An integer of minute interval between start and end time.
    """
    reverse = False
    if start > end:
        start, end = end, start
        reverse = True

    delta = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0
    if reverse:
        delta = 24*60 - delta
    return delta


def is_reservation_valid(data):
    """
    Check if customer can reserve their plan or not.

    Args:
        data: The data of reservation model in Json form.

    Returns:
        True if customer plan doesn't violate reservation rule else return False. 
    """
    list_of_time = []
    start = data["start"]
    date_object = datetime.strptime(start,"%Y-%m-%dT%H:%M:%SZ")
    list_reservation_object = Reservation.objects.filter(start__date=date_object)
    for i in list_reservation_object:
        update_time = i.end + timedelta(minutes=BREAK)
        list_of_time.append(i.start.time())
        list_of_time.append(update_time.time())
    for i in range(0,len(list_of_time)-1,2):
        if(list_of_time[i] < date_object.time() < list_of_time[i+1]):
            return False
    return True

def get_available_time(date, course):
    """
    Give a single list of available time.

    Args:
        customer_username: username of customer.
        data: The data of reservation. 
                '2022-07-30'
        course: The duration of time.

    Returns:
        A single list of pair of available time.
    """
    list_of_time = []
    date_object = datetime.strptime(date, '%Y-%m-%d')
    list_reservation_object = Reservation.objects.filter(start__date=date_object)
    insert_break_time(list_of_time)
    for i in list_reservation_object:
        update_time = i.end + timedelta(minutes=BREAK)
        list_of_time.append(i.start.time())
        list_of_time.append(update_time.time())
    list_of_time = sorted(list_of_time)
    list_of_available_time = []
    for i in range(0,len(list_of_time)-2,2):
        if minute_interval(list_of_time[i+1], list_of_time[i+2]) >= course+30:
            list_of_available_time.append({"start":list_of_time[i+1], "end":list_of_time[i+2]})   
    return time_interval(date_object, list_of_available_time, course) 

def time_interval(date_object, list_of_available_time, course):
    """
    Devide a range of time into sub interval which is depend on course durations.
    
    Args:
        list_of_available_time: dict of range of available time.
        course: The duration of time.
    Returns:
        A dict pair of available time.
    """
    list_of_sub_interval = []
    for i in list_of_available_time:
        date_object_start = datetime.strptime(str(i["start"]), '%H:%M:%S')
        date_object_end = datetime.strptime(str(i["end"]), '%H:%M:%S')
        current = date_object_start
        while current + timedelta(minutes = course) <= date_object_end:
            temp = current
            current = current + timedelta(minutes = course)
            if (date_object != datetime.today().replace(hour=0,minute=0,second=0,microsecond=0)):
                start = (str(datetime.combine(date_object, temp.time()))+"Z").replace(" ", "T")
                end = (str(datetime.combine(date_object, current.time()))+"Z").replace(" ", "T")
            else:
                if(datetime.now().time().replace(minute=0,second=0,microsecond=0) < temp.time()):
                    start = (str(datetime.combine(date_object, temp.time()))+"Z").replace(" ", "T")
                    end = (str(datetime.combine(date_object, current.time()))+"Z").replace(" ", "T")
            try:
                list_of_sub_interval.append({"start": start, "end": end})
            except:
                pass
    return list_of_sub_interval

def get_list_of_date_booking(list_of_available_date, list_of_full_date, list_of_close_date, close_date_object):
    """
    Find a available date, full date and close date.

    Args:
        list_of_available_date: A empty list for available date
        list_of_full_date: A empty list for full date
        list_of_close_date: A empty list for close date
        close_date_object: A list for close date
    Returns:
        list_of_available_date: A ist of available date
        list_of_full_date: A list of full date
        list_of_close_date: A list of close date
        close_date_object: A list of close date  
    """
    for date in close_date_object:
        list_of_close_date.append(date.close_date.strftime('%Y-%m-%d'))
    for i in range(WEEK*7):
        date = datetime.today() + timedelta(days=i)
        if len(get_available_time(date.strftime('%Y-%m-%d'),60)) == 0:
            list_of_full_date.append(date.strftime('%Y-%m-%d'))
        elif(date.strftime('%Y-%m-%d') not in list_of_close_date and date.isoweekday() != 7 ):
            list_of_available_date.append(date.strftime('%Y-%m-%d'))
    return list_of_available_date, list_of_full_date, list_of_close_date

def email_confirm(customer, reservation):
    """
    Send an Email for confirmations.

    Args:
        customer: An object of customer.
        reservation:  An object of reservation
    
    Returns:
        Void
    """
    send_mail('Thanks for your reservation',
                f"""Dear {customer.name} {customer.surname},
                    Your reservation on {reservation.start.date()} at {reservation.start.time()} to {reservation.end.time()} has been confirmed,

                Annatta Thai Massage.""",
                        EMAIL_HOST_USER,
                        [customer.email]
                )
    return
