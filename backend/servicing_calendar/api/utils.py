from .models import Customer, Reservation
from datetime import datetime, timedelta

BREAK = 30
LUNCH_BREAK = datetime.strptime('12-00-00', '%H-%M-%S')
LUNCH_BREAK_END = datetime.strptime('13-00-00', '%H-%M-%S')
OPEN = datetime.strptime('08-00-00', '%H-%M-%S')
OPEN_END = datetime.strptime('09-00-00', '%H-%M-%S')
CLOSE = datetime.strptime('19-00-00', '%H-%M-%S')
CLOSE_END = datetime.strptime('20-00-00', '%H-%M-%S')
LIST_OF_BREAK = [   OPEN.time(),
                    OPEN_END.time(),
                    LUNCH_BREAK.time(),
                    LUNCH_BREAK_END.time(),
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
    return True

def get_available_time(date, course):
    """
    Give a single list of available time.

    Args:
        customer_username: username of customer.
        data: The data of reservation. 
                '22-07-30'
        course: The duration of time.

    Returns:
        A single list of pair of available time.
    """
    list_of_time = []
    date_object = datetime.strptime(date, '%y-%m-%d')
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
            list_of_available_time.append([list_of_time[i+1], list_of_time[i+2]])   
    return list_of_available_time