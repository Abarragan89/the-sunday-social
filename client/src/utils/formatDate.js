export function formatDate(date) {
    const newDate = new Date(date);
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
}

export function formatDateShortYear(date) {
    const newDate = new Date(date);
    return `${newDate.getMonth() + 1}/${newDate.getDate()}`
}

export function getTime(inputDate) {
    // Create a new Date object with the provided timestamp
    const date = new Date(inputDate);

    // Get the hour and minute components
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine whether it's AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    const formattedHour = hours % 12 || 12; // 0 should be converted to 12

    // Format the hour and minute as a string
    const formattedTime = `${formattedHour}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    
    return formattedTime;

}